export interface AskNeighborhoodResult {
  answer: string
  sources: string[]
  fromCache: boolean
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787'

export async function askAboutNeighborhood(
  neighborhoodName: string,
  question: string,
): Promise<AskNeighborhoodResult> {
  const res = await fetch(`${API_BASE}/ask/${encodeURIComponent(neighborhoodName)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? 'Request failed')
  }

  return res.json()
}
