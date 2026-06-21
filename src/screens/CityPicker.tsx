import { useMemo, useRef, useState } from 'react'
import { useAppStore } from '../state/useAppStore'
import { WORLD_CITIES, type WorldCity } from '../data/worldCities'

const FEATURES = [
  {
    emoji: '✈️',
    title: 'Take the flight',
    text: 'Soar over the city on a guided aerial tour, narrated stop to stop.',
  },
  {
    emoji: '🗺️',
    title: 'Explore in 3D',
    text: 'Orbit, pan, and zoom a photoreal 3D map. Click anywhere to dive in.',
  },
  {
    emoji: '📚',
    title: 'Learn the place',
    text: 'Real history, stats, local tips, and what to do — like a friend showing you around.',
  },
]

export default function CityPicker() {
  const selectCity = useAppStore((s) => s.selectCity)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const blurTimer = useRef<number | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? WORLD_CITIES.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.country.toLowerCase().includes(q),
        )
      : WORLD_CITIES
    return list.slice(0, 8)
  }, [query])

  const choose = (c: WorldCity) => {
    if (c.cityId) {
      selectCity(c.cityId)
    } else {
      setQuery(c.name)
      setOpen(false)
      setNotice(`${c.name} isn’t available yet — try San Francisco to explore the Bay Area.`)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden px-6">
      {/* Ambient blobs */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sunset/10 blur-3xl"
        style={{ animation: 'floatSlow 9s ease-in-out infinite' }}
      />
      <div
        className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-sky/10 blur-3xl"
        style={{ animation: 'floatSlow 11s ease-in-out infinite 1s' }}
      />
      <div
        className="pointer-events-none absolute right-1/3 top-0 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
        style={{ animation: 'floatSlow 13s ease-in-out infinite 2s' }}
      />

      {/* HERO */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center pt-20 text-center sm:pt-28">
        <p
          className="rise-in mb-4 rounded-full bg-cream px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-cocoa shadow-sm"
          style={{ animationDelay: '0ms' }}
        >
          🌍 A local friend, in 3D
        </p>
        <h1
          className="rise-in bg-gradient-to-br from-ink via-cocoa to-sunset bg-clip-text font-display text-6xl font-bold leading-[1.05] text-transparent sm:text-7xl"
          style={{ animationDelay: '80ms' }}
        >
          City Explorer
        </h1>
        <p
          className="rise-in mt-5 max-w-xl text-lg leading-relaxed text-cocoa"
          style={{ animationDelay: '160ms' }}
        >
          New to a city? Get the lay of the land in minutes. Fly over the
          skyline on a guided tour, or roam a living 3D map and tap any place to
          learn its story.
        </p>

        {/* Search bar */}
        <div
          className="rise-in relative z-20 mt-9 w-full max-w-xl"
          style={{ animationDelay: '240ms' }}
        >
          <div className="flex items-center gap-2 rounded-2xl bg-cream p-2 shadow-xl ring-1 ring-black/5">
            <span className="pl-3 text-xl text-cocoa/50">🔍</span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
                setNotice(null)
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => {
                blurTimer.current = window.setTimeout(() => setOpen(false), 150)
              }}
              placeholder="Search a city to explore…"
              className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-lg text-ink outline-none placeholder:text-cocoa/40"
            />
          </div>

          {/* Dropdown */}
          {open && results.length > 0 && (
            <div
              className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl bg-cream shadow-2xl ring-1 ring-black/10"
              onMouseDown={(e) => e.preventDefault()}
            >
              {results.map((c) => {
                const supported = !!c.cityId
                return (
                  <button
                    key={`${c.name}-${c.country}`}
                    onMouseDown={() => {
                      if (blurTimer.current) window.clearTimeout(blurTimer.current)
                      choose(c)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-parchment"
                  >
                    <span className="text-lg">{supported ? '📍' : '🌐'}</span>
                    <span className="flex-1">
                      <span className="block font-medium text-ink">{c.name}</span>
                      <span className="block text-xs text-cocoa/60">
                        {c.country}
                      </span>
                    </span>
                    {supported ? (
                      <span className="rounded-full bg-sage/20 px-2.5 py-0.5 text-[11px] font-semibold text-sage">
                        ● Available
                      </span>
                    ) : (
                      <span className="rounded-full bg-cocoa/10 px-2.5 py-0.5 text-[11px] font-medium text-cocoa/50">
                        Soon
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {notice && (
            <p className="mt-3 rounded-xl bg-sunset/10 px-4 py-2 text-sm text-sunset">
              {notice}
            </p>
          )}

          <button
            onClick={() => selectCity('bay-area')}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cocoa transition hover:text-ink"
          >
            or jump straight to{' '}
            <span className="font-semibold text-sunset">San Francisco →</span>
          </button>
        </div>
      </div>

      {/* FEATURE STRIP */}
      <div className="relative z-10 mb-20 mt-16 grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="rise-in rounded-2xl bg-cream/80 p-5 text-center shadow-sm ring-1 ring-black/5"
            style={{ animationDelay: `${340 + i * 90}ms` }}
          >
            <div className="text-3xl">{f.emoji}</div>
            <h3 className="mt-2 font-display text-lg font-bold text-ink">
              {f.title}
            </h3>
            <p className="mt-1 text-sm leading-snug text-cocoa">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
