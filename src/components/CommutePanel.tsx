import { useState } from 'react'
import type { Place } from '../data/types'
import {
  computeAllModes,
  formatDistance,
  formatDuration,
  type RouteResult,
  type TravelMode,
} from '../cesium/routesApi'

interface CommutePanelProps {
  places: Place[]
  onClose: () => void
  /** Draw the chosen route's path on the map. */
  onShowRoute: (path: [number, number][]) => void
}

const MODE_META: Record<TravelMode, { label: string }> = {
  DRIVE: { label: 'Drive' },
  TRANSIT: { label: 'Transit' },
  BICYCLE: { label: 'Bike' },
  WALK: { label: 'Walk' },
}

export default function CommutePanel({
  places,
  onClose,
  onShowRoute,
}: CommutePanelProps) {
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<RouteResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sorted = [...places].sort((a, b) => a.name.localeCompare(b.name))

  const go = async () => {
    const from = places.find((p) => p.id === fromId)
    const to = places.find((p) => p.id === toId)
    if (!from || !to || from.id === to.id) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const r = await computeAllModes(
        { lat: from.lat, lng: from.lng },
        { lat: to.lat, lng: to.lng },
      )
      if (r.length === 0) {
        setError('No routes found for those places.')
      } else {
        setResults(r)
        // Draw the fastest route by default.
        const fastest = [...r].sort((a, b) => a.seconds - b.seconds)[0]
        onShowRoute(fastest.path)
      }
    } catch {
      setError('Couldn’t reach the routing service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="pointer-events-auto absolute right-4 top-16 z-30 w-72 overflow-hidden rounded-2xl bg-cream shadow-xl ring-1 ring-black/5"
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

      <div className="space-y-2.5 p-4">
        <Select
          label="From"
          value={fromId}
          onChange={setFromId}
          places={sorted}
          exclude={toId}
        />
        <Select
          label="To"
          value={toId}
          onChange={setToId}
          places={sorted}
          exclude={fromId}
        />

        <button
          onClick={go}
          disabled={!fromId || !toId || fromId === toId || loading}
          className="w-full rounded-full bg-sunset py-2.5 text-sm font-semibold text-cream shadow transition hover:bg-[#d9632d] disabled:opacity-40"
        >
          {loading ? 'Calculating…' : 'Get travel times'}
        </button>

        {error && <p className="text-xs text-[#C2452D]">{error}</p>}

        {results && (
          <div className="space-y-1.5 pt-1">
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
                  <span className="w-16 shrink-0 text-[13px] font-medium text-cocoa">
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

function Select({
  label,
  value,
  onChange,
  places,
  exclude,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  places: Place[]
  exclude: string
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wide text-cocoa">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-cocoa/15 bg-parchment/40 px-2.5 py-2 text-sm text-ink outline-none focus:border-cocoa/30"
      >
        <option value="">Choose a place…</option>
        {places
          .filter((p) => p.id !== exclude)
          .map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
      </select>
    </label>
  )
}
