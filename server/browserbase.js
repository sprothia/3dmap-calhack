import Browserbase from '@browserbasehq/sdk'
import { chromium } from 'playwright-core'

function getClient() {
  const apiKey = process.env.BROWSERBASE_API_KEY
  if (!apiKey) {
    throw new Error('Missing BROWSERBASE_API_KEY in .env.')
  }
  return new Browserbase({ apiKey })
}

export async function createSession() {
  const projectId = process.env.BROWSERBASE_PROJECT_ID
  if (!projectId) {
    throw new Error(
      'Missing BROWSERBASE_PROJECT_ID in .env — get a project ID from the Browserbase dashboard.',
    )
  }
  const bb = getClient()
  // Reddit (and others) block Browserbase's default datacenter IPs outright —
  // route through Browserbase's proxy network so scrapes look like real traffic.
  return bb.sessions.create({ projectId, proxies: true })
}

export async function connectBrowser(session) {
  return chromium.connectOverCDP(session.connectUrl)
}

export async function closeSession(session, browser) {
  try {
    await browser.close()
  } catch {
    // Non-fatal — Browserbase still needs an explicit release below.
  }
  try {
    // browser.close() only disconnects our CDP client; without this, the
    // session stays RUNNING on Browserbase's side until its own timeout,
    // which can exhaust a low concurrent-session limit between requests.
    await getClient().sessions.update(session.id, {
      status: 'REQUEST_RELEASE',
      projectId: process.env.BROWSERBASE_PROJECT_ID,
    })
  } catch (err) {
    console.error('Failed to release Browserbase session:', err.message)
  }
}
