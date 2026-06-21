import type { Place } from './types'

// Deterministic, always-resolving scenic fallbacks so every place shows at
// least two photos even when its own gallery is sparse. Keyed off the place id
// so the same place always gets the same fillers (stable across renders).
const FALLBACK_BASE = 'https://picsum.photos/seed'

function fallbackFor(place: Place, n: number): string {
  const seed = `${place.id}-${place.category}-${n}`
  return `${FALLBACK_BASE}/${encodeURIComponent(seed)}/800/600`
}

/**
 * Returns the gallery image URLs for a place, guaranteed to contain at least
 * `min` entries. Real images come first (hero, then extras); the remainder is
 * padded with stable scenic fillers.
 */
export function placeGallery(place: Place, min = 2): string[] {
  const real = [
    ...(place.image ? [place.image] : []),
    ...(place.images ?? []),
  ].filter((src, i, arr) => arr.indexOf(src) === i)

  const out = [...real]
  let n = 0
  while (out.length < min) {
    out.push(fallbackFor(place, n))
    n += 1
  }
  return out
}
