// Centralized access to the API keys the 3D map needs.
// Keys live in .env (gitignored); see .env.example.

export const cesiumIonToken = import.meta.env.VITE_CESIUM_ION_TOKEN ?? ''
export const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY ?? ''

export const hasMapKeys = Boolean(cesiumIonToken && googleMapsKey)
