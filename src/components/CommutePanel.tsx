import { useId, useMemo, useState } from 'react'
import type { Place } from '../data/types'
import {
  computeAllModes,
  formatDistance,
  formatDuration,
  geocodeAddress,
  type GeoPoint,
  type RouteResult,
  type TravelMode,
} from '../cesium/routesApi'

interface CommutePanelProps {
  places: Place[]
  onClose: () => void
  /** Draw the chosen route's path on the map. */
  onShowRoute: (path: [number, number][]) => void
}

const MODE_META: Record<TravelMode, { label: string; icon: string }> = {
  DRIVE: { label: 'Drive', icon: '🚗' },
  TRANSIT: { label: 'Transit', icon: '🚆' },
  BICYCLE: { label: 'Bike', icon: '🚲' },
  WALK: { label: 'Walk', icon: '🚶' },
}

export default function CommutePanel({
  places,
  onClose,
  onShowRoute,
}: CommutePanelProps) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [fromResolved, setFromResolved] = useState<GeoPoint | null>(null)
  const [toResolved, setToResolved] = useState<GeoPoint | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<RouteResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const listId = useId()

  const sorted = useMemo(
    () => [...places].sort((a, b) => a.name.localeCompare(b.name)),
    [places],
  )

  // A typed value resolves to a known place (exact name) or a geocoded address.
  const resolveEndpoint = async (text: string): Promise<GeoPoint | null> => {
    const q = text.trim()
    if (!q) return null
    const place = places.find((p) => p.name.toLowerCase() === q.toLowerCase())
    if (place) return { lat: place.lat, lng: place.lng, label: place.name }
    return geocodeAddress(q)
  }

  const swap = () => {
    setFrom(to)
    setTo(from)
    setFromResolved(toResolved)
    setToResolved(fromResolved)
    setResults(null)
  }

  const go = async () => {
    setLoading(true)
    setError(null)
    setResults(null)
    setFromResolved(null)
    setToResolved(null)
    try {
      const [origin, destination] = await Promise.all([
        resolveEndpoint(from),
        resolveEndpoint(to),
      ])
      if (!origin) {
        setError(`Couldn’t find “${from.trim()}”. Try a fuller address.`)
        return
      }
      if (!destination) {
        setError(`Couldn’t find “${to.trim()}”. Try a fuller address.`)
        return
      }
      setFromResolved(origin)
      setToResolved(destination)
      const r = await computeAllModes(
        { lat: origin.lat, lng: origin.lng },
        { lat: destination.lat, lng: destination.lng },
      )
      if (r.length === 0) {
        setError('No routes found between those two points.')
      } else {
        setResults(r)
        const fastest = [...r].sort((a, b) => a.seconds - b.seconds)[0]
        onShowRoute(fastest.path)
      }
    } catch {
      setError('Couldn’t reach the routing service.')
    } finally {
      setLoading(false)
    }
  }

  const canGo = from.trim().length > 0 && to.trim().length > 0 && !loading

  return (
    <div
      className="pointer-events-auto absolute right-4 top-16 z-30 w-80 overflow-hidden rounded-2xl bg-cream shadow-2xl ring-1 ring-black/5"
      style={{ animation: 'fadeInPlace 0.3s ease both' }}
    >
      <div className="flex items-center justify-between bg-gradient-to-br from-ink to-cocoa px-4 py-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cream/60">
            Plan a trip
          </p>
          <p className="font-display text-lg font-bold text-cream">Commute</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-cream/70 transition hover:text-cream"
        >
          ✕
        </button>
      </div>

      <div className="p-4">
        {/* From / To with the connecting rail + swap control */}
        <div className="relative">
          <div className="absolute left-[9px] top-7 bottom-7 w-px bg-cocoa/20" />
          <EndpointField
            dotClass="bg-sunset"
            label="From"
            value={from}
            onChange={(v) => {
              setFrom(v)
              setFromResolved(null)
            }}
            placeholder="Place or address…"
            listId={listId}
            resolved={fromResolved}
          />
          <button
            onClick={swap}
            title="Swap"
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-cocoa/15 bg-parchment px-2 py-1 text-xs text-cocoa transition hover:bg-parchment/60 active:scale-95"
          >
            ⇅
          </button>
          <EndpointField
            dotClass="bg-ink"
            label="To"
            value={to}
            onChange={(v) => {
              setTo(v)
              setToResolved(null)
            }}
            placeholder="Place or address…"
            listId={listId}
            resolved={toResolved}
          />
        </div>

        <datalist id={listId}>
          {sorted.map((p) => (
            <option key={p.id} value={p.name} />
          ))}
        </datalist>

        <button
          onClick={go}
          disabled={!canGo}
          className="mt-3 w-full rounded-full bg-sunset py-2.5 text-sm font-semibold text-cream shadow transition hover:bg-[#d9632d] disabled:opacity-40"
        >
          {loading ? 'Calculating…' : 'Get travel times'}
        </button>

        <p className="mt-2 text-center text-[10px] text-cocoa/55">
          Pick a highlighted place, or type any Bay Area address.
        </p>

        {error && <p className="mt-2 text-xs text-[#C2452D]">{error}</p>}

        {results && (
          <div className="mt-3 space-y-1.5 border-t border-cocoa/10 pt-3">
            {[...results]
              .sort((a, b) => a.seconds - b.seconds)
              .map((r, i) => (
                <button
                  key={r.mode}
                  onClick={() => onShowRoute(r.path)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition hover:bg-parchment ${
                    i === 0 ? 'border-sunset/40 bg-sunset/5' : 'border-cocoa/10'
                  }`}
                >
                  <span className="text-lg">{MODE_META[r.mode].icon}</span>
                  <span className="w-12 shrink-0 text-[13px] font-medium text-cocoa">
                    {MODE_META[r.mode].label}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-ink">
                      {formatDuration(r.seconds)}
                    </span>
                    <span className="block text-[11px] text-cocoa">
                      {formatDistance(r.meters)}
                    </span>
                  </span>
                  {i === 0 && (
                    <span className="rounded-full bg-sunset px-2 py-0.5 text-[10px] font-bold text-cream">
                      Fastest
                    </span>
                  )}
                </button>
              ))}
            <p className="pt-1 text-center text-[10px] text-cocoa/60">
              Live times via Google Routes
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function EndpointField({
  dotClass,
  label,
  value,
  onChange,
  placeholder,
  listId,
  resolved,
}: {
  dotClass: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  listId: string
  resolved: GeoPoint | null
}) {
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <span className={`mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`} />
      <label className="min-w-0 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wide text-cocoa">
          {label}
        </span>
        <input
          list={listId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-0.5 w-full rounded-lg border border-cocoa/15 bg-parchment/40 px-2.5 py-2 pr-7 text-sm text-ink outline-none focus:border-cocoa/30"
        />
        {resolved && (
          <span className="mt-1 block truncate text-[10px] text-cocoa/60">
            📍 {resolved.label}
          </span>
        )}
      </label>
    </div>
  )
}
