import express from 'express'
import cors from 'cors'
import { getCached, setCached } from './cache.js'
import { scrapeAll } from './scrape.js'
import { synthesizeAnswer } from './claude.js'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/ask/:neighborhoodId', async (req, res) => {
  const neighborhoodName = decodeURIComponent(req.params.neighborhoodId)
  const question = req.body?.question
  if (typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'question is required' })
  }

  const cacheKey = `${neighborhoodName}::${question.trim().toLowerCase()}`
  const cached = getCached(cacheKey)
  if (cached) {
    return res.json({ ...cached, fromCache: true })
  }

  try {
    const sources = await scrapeAll(neighborhoodName, question)
    const result = await synthesizeAnswer(neighborhoodName, question, sources)
    if (result.sources.length > 0) {
      setCached(cacheKey, result)
    }
    res.json({ ...result, fromCache: false })
  } catch (err) {
    console.error('Failed to answer neighborhood question:', err)
    res.status(502).json({ error: 'Could not fetch live information right now. Please try again.' })
  }
})

const port = process.env.PORT ?? 8787
app.listen(port, () => {
  console.log(`Neighborhood Q&A server listening on :${port}`)
})
