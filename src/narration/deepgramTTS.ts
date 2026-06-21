// Thin wrapper around Deepgram's text-to-speech REST endpoint.
// No React here — just "give me text, get back a playable audio URL".
import { deepgramApiKey, hasDeepgramKey } from '../cesium/env'

// Aura-2 voice: warm and friendly, fits the "local friend showing you around"
// tone. Swap freely — see https://developers.deepgram.com/docs/tts-models
export const DEEPGRAM_TTS_MODEL = 'aura-2-thalia-en'

const ENDPOINT = `https://api.deepgram.com/v1/speak?model=${DEEPGRAM_TTS_MODEL}`

// Synthesized clips keyed by text → object URL. Tour beats repeat as the user
// navigates back and forth, so we only hit the API once per unique line.
const cache = new Map<string, string>()

/**
 * Synthesize `text` to speech and return an object URL playable by an <audio>
 * element. Results are cached by text. Pass an AbortSignal to cancel in-flight
 * requests when the user moves on before audio is ready.
 */
export async function synthesizeSpeech(
  text: string,
  signal?: AbortSignal,
): Promise<string> {
  const key = text.trim()
  const cached = cache.get(key)
  if (cached) return cached

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Token ${deepgramApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: key }),
    signal,
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Deepgram TTS failed (${res.status}) ${detail}`.trim())
  }

  const url = URL.createObjectURL(await res.blob())
  cache.set(key, url)
  return url
}

/**
 * Warm the cache for a line we expect to play soon, so the real `speak` is an
 * instant cache hit instead of a network round-trip. Fire-and-forget: failures
 * are ignored here and surfaced (or retried) when the line actually plays.
 */
export function prefetchSpeech(text: string): void {
  if (!hasDeepgramKey || !text?.trim()) return
  void synthesizeSpeech(text).catch(() => {})
}
