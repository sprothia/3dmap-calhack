import { useState } from 'react'
import type { Category, City, Place } from '../data/types'
import {
  ALL_CATEGORIES,
  CATEGORY_COLOR,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
} from '../data/categories'

interface CategorySidebarProps {
  city: City
  /** Active categories (null = all shown). */
  active: Category[] | null
  onToggle: (cat: Category) => void
  onShowAll: () => void
  onPickPlace: (place: Place) => void
  selectedPlaceId: string | null
}

export default function CategorySidebar({
  city,
  active,
  onToggle,
  onShowAll,
  onPickPlace,
  selectedPlaceId,
}: CategorySidebarProps) {
  const [expanded, setExpanded] = useState<Category | null>(null)
  const [query, setQuery] = useState('')

  const isActive = (c: Category) => active === null || active.includes(c)
  const countFor = (c: Category) =>
    city.places.filter((p) => p.category === c).length

  const matches =
    query.trim().length > 0
      ? city.places.filter((p) =>
          p.name.toLowerCase().includes(query.trim().toLowerCase()),
        )
      : null

  const surprise = () => {
    const pool = city.places
    const pick = pool[Math.floor(Math.random() * pool.length)]
    if (pick) onPickPlace(pick)
  }

  return (
    <div className="pointer-events-auto absolute left-4 top-4 z-20 flex max-h-[calc(100vh-2rem)] w-64 flex-col overflow-hidden rounded-2xl border border-cocoa/15 bg-cream/95 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="font-display text-lg font-semibold text-ink">Explore</h2>
        <button
          onClick={onShowAll}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
            active === null
              ? 'bg-ink text-cream'
              : 'bg-parchment text-cocoa hover:bg-parchment/70'
          }`}
        >
          All
        </button>
      </div>

      {/* Search + surprise */}
      <div className="flex items-center gap-1.5 px-4 pb-2 pt-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search places…"
          className="min-w-0 flex-1 rounded-full border border-cocoa/15 bg-parchment/40 px-3 py-1.5 text-sm text-ink outline-none placeholder:text-cocoa/50 focus:border-cocoa/30"
        />
        <button
          onClick={surprise}
          title="Surprise me"
          className="shrink-0 rounded-full bg-sunset px-2.5 py-1.5 text-sm text-cream transition hover:bg-[#d9632d] active:scale-95"
        >
          🎲
        </button>
      </div>

      {/* Search results */}
      {matches && (
        <div className="max-h-56 overflow-y-auto px-2 pb-2">
          {matches.length === 0 ? (
            <p className="px-2 py-2 text-xs text-cocoa/60">No places found.</p>
          ) : (
            matches.map((p) => (
              <button
                key={p.id}
                onClick={() => onPickPlace(p)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-cocoa transition hover:bg-parchment"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLOR[p.category] }}
                />
                {p.name}
              </button>
            ))
          )}
        </div>
      )}

      {!matches && (
        <p className="px-4 pb-2 pt-1 text-xs text-cocoa">
          Filter the map · click a place to fly there
        </p>
      )}

      <div className={`flex-1 overflow-y-auto px-2 pb-3 ${matches ? 'hidden' : ''}`}>
        {ALL_CATEGORIES.map((cat) => {
          const on = isActive(cat)
          const count = countFor(cat)
          if (count === 0) return null
          const open = expanded === cat
          const places = city.places.filter((p) => p.category === cat)
          return (
            <div key={cat} className="mb-1">
              <button
                onClick={() => {
                  onToggle(cat)
                  setExpanded(open ? null : cat)
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
                  on ? 'bg-parchment/60' : 'opacity-45 hover:opacity-80'
                }`}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ backgroundColor: CATEGORY_COLOR[cat] + '26' }}
                >
                  {CATEGORY_EMOJI[cat]}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">
                    {CATEGORY_LABEL[cat]}
                  </span>
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: CATEGORY_COLOR[cat] }}
                >
                  {count}
                </span>
              </button>

              {/* Expandable place list */}
              {open && (
                <ul className="ml-9 mt-0.5 space-y-0.5 border-l border-cocoa/10 pl-2">
                  {places.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => onPickPlace(p)}
                        className={`block w-full rounded-md px-2 py-1 text-left text-[13px] transition hover:bg-parchment ${
                          selectedPlaceId === p.id
                            ? 'font-semibold text-ink'
                            : 'text-cocoa'
                        }`}
                      >
                        {p.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
