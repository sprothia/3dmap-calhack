const store = new Map()

export function getCached(key) {
  const entry = store.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return undefined
  }
  return entry.data
}

export function setCached(key, data, ttlMs = 60 * 60 * 1000) {
  store.set(key, { data, expiresAt: Date.now() + ttlMs })
}
