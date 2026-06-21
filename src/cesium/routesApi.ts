import { googleMapsKey } from './env'

export type TravelMode = 'DRIVE' | 'WALK' | 'BICYCLE' | 'TRANSIT'

export interface RouteResult {
  mode: TravelMode
  /** Duration in seconds. */
  seconds: number
  /** Distance in meters. */
  meters: number
  /** Decoded path as [lng, lat] pairs for drawing on the map. */
  path: [number, number][]
}

interface LatLng {
  lat: number
  lng: number
}

/**
 * Calls the Google Routes API (computeRoutes) for a single origin→destination
 * in a given travel mode. Returns real duration, distance, and the route path.
 */
export async function computeRoute(
  origin: LatLng,
  destination: LatLng,
  mode: TravelMode,
): Promise<RouteResult | null> {
  const body: Record<string, unknown> = {
    origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
    destination: {
      location: { latLng: { latitude: destination.lat, longitude: destination.lng } },
    },
    travelMode: mode,
  }
  // Routing preference is only valid for DRIVE/BICYCLE.
  if (mode === 'DRIVE') body.routingPreference = 'TRAFFIC_AWARE'

  const res = await fetch(
    `https://routes.googleapis.com/directions/v2:computeRoutes?key=${googleMapsKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-FieldMask':
          'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
      },
      body: JSON.stringify(body),
    },
  )
  if (!res.ok) return null
  const data = await res.json()
  const route = data.routes?.[0]
  if (!route) return null

  const seconds = parseInt(String(route.duration ?? '0').replace('s', ''), 10) || 0
  const meters = route.distanceMeters ?? 0
  const encoded = route.polyline?.encodedPolyline ?? ''
  return { mode, seconds, meters, path: decodePolyline(encoded) }
}

/** Compute all four modes in parallel; failed modes are omitted. */
export async function computeAllModes(
  origin: LatLng,
  destination: LatLng,
): Promise<RouteResult[]> {
  const modes: TravelMode[] = ['DRIVE', 'TRANSIT', 'BICYCLE', 'WALK']
  const results = await Promise.all(
    modes.map((m) => computeRoute(origin, destination, m).catch(() => null)),
  )
  return results.filter((r): r is RouteResult => r !== null)
}

/** Decode a Google encoded polyline to [lng, lat] pairs. */
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = []
  let index = 0
  let lat = 0
  let lng = 0
  while (index < encoded.length) {
    let result = 0
    let shift = 0
    let b: number
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1

    result = 0
    shift = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1

    points.push([lng / 1e5, lat / 1e5])
  }
  return points
}

/** Format seconds as a friendly "X min" / "X hr Y min". */
export function formatDuration(seconds: number): string {
  const min = Math.round(seconds / 60)
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} hr ${m} min` : `${h} hr`
}

/** Format meters as mi/ft. */
export function formatDistance(meters: number): string {
  const miles = meters / 1609.34
  if (miles < 0.2) return `${Math.round(meters * 3.281)} ft`
  return `${miles.toFixed(1)} mi`
}
