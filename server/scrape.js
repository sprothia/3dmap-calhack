import { createSession, connectBrowser, closeSession } from './browserbase.js'

const MAX_CHARS = 4000
const MIN_USABLE_CHARS = 50

// Anti-bot/consent/CAPTCHA walls (Reddit's datacenter-IP block, Google's
// consent page, etc.) return real HTTP 200s with boilerplate text that would
// otherwise sail past the length check — detect and treat as a failed scrape.
const BLOCK_SIGNATURES =
  /blocked by|network (policy|security)|whoa there|captcha|unusual traffic|verify you are human|access denied|before you continue|doesn.?t exist|private|banned/i

function isBlocked(text) {
  return BLOCK_SIGNATURES.test(text)
}

function truncate(text) {
  return text.replace(/\s+/g, ' ').trim().slice(0, MAX_CHARS)
}

function extractText(page) {
  return page.evaluate(() => document.body.innerText)
}

function subredditCandidate(neighborhoodName) {
  return neighborhoodName.split('/')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
}

async function scrapeReddit(browser, neighborhoodName, question) {
  const page = await browser.newPage()
  try {
    const url = `https://old.reddit.com/r/bayarea/search?q=${encodeURIComponent(`${neighborhoodName} ${question}`)}&restrict_sr=1&sort=relevance`
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await page.waitForSelector('.search-result-link, .nothing-found', { timeout: 8000 }).catch(() => null)
    const text = truncate(await extractText(page))
    if (text.length < MIN_USABLE_CHARS || isBlocked(text)) return null
    return { label: 'Reddit r/bayarea', url, text }
  } finally {
    await page.close()
  }
}

// Best-effort guess at a neighborhood-specific subreddit; silently skipped if it
// doesn't exist (most neighborhood names won't have a dedicated subreddit).
async function scrapeNeighborhoodSubreddit(browser, neighborhoodName, question) {
  const candidate = subredditCandidate(neighborhoodName)
  if (!candidate) return null
  const page = await browser.newPage()
  try {
    const url = `https://old.reddit.com/r/${candidate}/search?q=${encodeURIComponent(question)}&restrict_sr=1`
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
    const title = await page.title()
    if (isBlocked(title)) return null
    await page.waitForSelector('.search-result-link, .nothing-found', { timeout: 8000 }).catch(() => null)
    const text = truncate(await extractText(page))
    if (text.length < MIN_USABLE_CHARS || isBlocked(text)) return null
    return { label: `Reddit r/${candidate}`, url, text }
  } catch {
    return null
  } finally {
    await page.close()
  }
}

async function scrapeYelp(browser, neighborhoodName, question) {
  const page = await browser.newPage()
  try {
    const url = `https://www.yelp.com/search?find_desc=${encodeURIComponent(question)}&find_loc=${encodeURIComponent(`${neighborhoodName}, San Francisco, CA`)}`
    await page.goto(url, { waitUntil: 'load', timeout: 20000 })
    await page.waitForSelector('[data-testid="serp-ia-card"], main', { timeout: 8000 }).catch(() => null)
    await page.waitForTimeout(1500)
    const text = truncate(await extractText(page))
    if (text.length < MIN_USABLE_CHARS || isBlocked(text)) return null
    return { label: 'Yelp', url, text }
  } finally {
    await page.close()
  }
}

// Most likely of the three to hit a CAPTCHA/consent wall — bail out cleanly
// rather than feeding Claude garbage if that happens.
async function scrapeGoogle(browser, neighborhoodName, question) {
  const page = await browser.newPage()
  try {
    const url = `https://www.google.com/search?q=${encodeURIComponent(`${neighborhoodName} ${question}`)}`
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
    const title = await page.title()
    if (isBlocked(title)) return null
    const text = truncate(await extractText(page))
    if (text.length < MIN_USABLE_CHARS || isBlocked(text)) return null
    return { label: 'Google', url, text }
  } finally {
    await page.close()
  }
}

// Browserbase's plan caps concurrent sessions (often at 1) — serialize the
// create-scrape-release lifecycle so simultaneous requests queue instead of
// racing for the same slot and 429ing.
let sessionQueue = Promise.resolve()

export function scrapeAll(neighborhoodName, question) {
  const run = sessionQueue.then(() => scrapeAllNow(neighborhoodName, question))
  sessionQueue = run.catch(() => {})
  return run
}

async function scrapeAllNow(neighborhoodName, question) {
  const session = await createSession()
  const browser = await connectBrowser(session)
  try {
    const scrapers = [
      { label: 'Reddit r/bayarea', run: () => scrapeReddit(browser, neighborhoodName, question) },
      { label: 'Reddit (neighborhood subreddit)', run: () => scrapeNeighborhoodSubreddit(browser, neighborhoodName, question) },
      { label: 'Yelp', run: () => scrapeYelp(browser, neighborhoodName, question) },
      { label: 'Google', run: () => scrapeGoogle(browser, neighborhoodName, question) },
    ]
    const settled = await Promise.all(
      scrapers.map(async ({ label, run }) => {
        try {
          const result = await run()
          if (result) {
            console.log(`Scraped ${result.label}: ${result.text.length} chars`)
            return result
          }
          console.log(`No usable text from ${label} (skipped — blocked or no results)`)
          return null
        } catch (err) {
          console.error(`${label} failed:`, err.message)
          return null
        }
      }),
    )
    return settled.filter(Boolean)
  } finally {
    await closeSession(session, browser)
  }
}
