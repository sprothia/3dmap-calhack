// Centralized access to the API keys the 3D map needs.
// Keys live in .env (gitignored); see .env.example.

export const cesiumIonToken = import.meta.env.VITE_CESIUM_ION_TOKEN ?? ''
export const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY ?? ''

export const hasMapKeys = Boolean(cesiumIonToken && googleMapsKey)

// Optional: Deepgram key for spoken narration (TTS). Voice is purely additive —
// when this is blank the app stays text-only and the audio controls hide.
export const deepgramApiKey = import.meta.env.VITE_DEEPGRAM_API_KEY ?? ''
export const hasDeepgramKey = Boolean(deepgramApiKey)
