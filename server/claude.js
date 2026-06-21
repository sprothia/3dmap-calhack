import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-sonnet-4-6'

const ANSWER_TOOL = {
  name: 'answer_question',
  description:
    'Provide a direct answer to the question about the neighborhood, synthesized only from the supplied scraped source text, plus which sources actually backed the answer.',
  input_schema: {
    type: 'object',
    properties: {
      answer: { type: 'string', description: 'A direct, concise answer to the question.' },
      sources: {
        type: 'array',
        items: { type: 'string' },
        description: 'Source labels (from the supplied context) that actually contained information used in the answer.',
      },
    },
    required: ['answer', 'sources'],
  },
}

export async function synthesizeAnswer(neighborhoodName, question, sources) {
  if (sources.length === 0) {
    return {
      answer: "I couldn't find live information about that right now — try again in a moment or ask something else.",
      sources: [],
    }
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const context = sources.map((s) => `### ${s.label} (${s.url})\n${s.text}`).join('\n\n')
  const validLabelList = sources.map((s) => `"${s.label}"`).join(', ')

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    tools: [ANSWER_TOOL],
    tool_choice: { type: 'tool', name: ANSWER_TOOL.name },
    messages: [
      {
        role: 'user',
        content: `Someone is visiting "${neighborhoodName}" and asked: "${question}"\n\nHere is raw scraped text from real web sources about this neighborhood:\n\n${context}\n\nAnswer the question directly and conversationally, using ONLY information found in the scraped text above. Do not invent facts. If the text doesn't answer the question, say so plainly.\n\nThe "sources" array must contain ONLY values copied verbatim from this exact list of scrape labels: [${validLabelList}]. These are the labels of the pages that were scraped — they are NOT the same as website names that might be mentioned inside the scraped text (e.g. a snippet from the "Google" scrape may quote or reference TripAdvisor, Yelp reviews, or a Reddit post; in that case the correct source label is still "Google", since that's the page that was actually scraped). Never output a label that isn't in the list above.`,
      },
    ],
  })

  const toolUse = response.content.find((block) => block.type === 'tool_use')
  if (!toolUse) {
    throw new Error('Claude did not return a structured answer')
  }

  // Guard against the model citing a label that wasn't actually scraped.
  const validLabels = new Set(sources.map((s) => s.label))
  const citedSources = (toolUse.input.sources ?? []).filter((label) => validLabels.has(label))

  return { answer: toolUse.input.answer, sources: citedSources }
}
