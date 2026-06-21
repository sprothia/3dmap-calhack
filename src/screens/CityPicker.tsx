import { useMemo, useRef, useState } from 'react'
import { useAppStore } from '../state/useAppStore'
import { WORLD_CITIES, type WorldCity } from '../data/worldCities'
import HeroMapField from '../components/landing/HeroMapField'
import LegendGrid from '../components/landing/LegendGrid'
import './landing.css'

const QUICK_CITIES = [
  'San Francisco',
  'New York',
  'Chicago',
  'New Orleans',
] as const

function SearchGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="3" />
      <circle cx="11" cy="11" r="7.5" />
      <line x1="11" y1="1.5" x2="11" y2="4" />
      <line x1="11" y1="18" x2="11" y2="20.5" />
      <line x1="1.5" y1="11" x2="4" y2="11" />
      <line x1="18" y1="11" x2="20.5" y2="11" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg width="20" height="26" viewBox="0 0 20 26" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M10 2 L14 18 L10 14 L6 18 Z" fill="#2A4ACB" stroke="none" />
      <line x1="10" y1="14" x2="10" y2="24" />
    </svg>
  )
}

export default function CityPicker() {
  const selectCity = useAppStore((s) => s.selectCity)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const blurTimer = useRef<number | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

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
      setNotice(`${c.name} isn't available yet — try San Francisco to explore the Bay Area.`)
    }
  }

  const explore = () => {
    const q = query.trim().toLowerCase()
    if (!q) {
      selectCity('bay-area')
      return
    }

    const exact = WORLD_CITIES.find((c) => c.name.toLowerCase() === q)
    if (exact) {
      choose(exact)
      return
    }

    const partial = WORLD_CITIES.find(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
    )
    if (partial) {
      choose(partial)
      return
    }

    setNotice(`We couldn't find "${query.trim()}" — try San Francisco to explore the Bay Area.`)
    flashSearch()
  }

  const flashSearch = () => {
    const el = searchRef.current
    if (!el) return
    el.style.transform = 'translateY(-1px)'
    window.setTimeout(() => {
      el.style.transform = ''
    }, 150)
  }

  const pickChip = (name: string) => {
    setQuery(name)
    setNotice(null)
    setOpen(false)
    const match = WORLD_CITIES.find((c) => c.name.toLowerCase() === name.toLowerCase())
    if (match) choose(match)
    else setNotice(`${name} isn't available yet — try San Francisco to explore the Bay Area.`)
  }

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <HeroMapField />
        <div className="landing-veil" />

        <div className="landing-inst landing-inst-bl landing-mono">
          <CompassIcon />
          <span>N</span>
        </div>
        <div className="landing-inst landing-inst-br landing-mono">
          <div className="landing-scalebar">
            <div className="landing-scalebar-bar">
              <i />
              <i />
              <i />
              <i />
            </div>
            <span>0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;500&nbsp;m</span>
          </div>
        </div>

        <div className="landing-hero-inner">
          <h1 className="landing-title landing-rise d1">
            City Explorer
            <span className="landing-title-underline" />
          </h1>
          <p className="landing-lede landing-rise d2">
            New to a city? Get your bearings in minutes. <b>Sweep the skyline</b> to light it up,
            fly a guided route, then roam a living <b>3-D map</b> and tap any place to hear its
            story.
          </p>

          <div className="landing-search-wrap search-wrap landing-rise d3">
            <div ref={searchRef} className="landing-search relative">
              <span className="landing-search-glyph" aria-hidden="true">
                <SearchGlyph />
              </span>
              <input
                type="text"
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') explore()
                }}
                placeholder="Search any city…"
                aria-label="Search a city to explore"
                autoComplete="off"
              />
              <button type="button" className="landing-go" onClick={explore}>
                Explore
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="12" x2="19" y2="12" />
                  <polyline points="13 6 19 12 13 18" />
                </svg>
              </button>

              {open && results.length > 0 && query.trim() && (
                <div
                  className="landing-dropdown"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {results.map((c) => {
                    const supported = !!c.cityId
                    return (
                      <button
                        key={`${c.name}-${c.country}`}
                        type="button"
                        className="landing-dropdown-item"
                        onMouseDown={() => {
                          if (blurTimer.current) window.clearTimeout(blurTimer.current)
                          choose(c)
                        }}
                      >
                        <span className="flex-1">
                          <span className="block font-medium">{c.name}</span>
                          <span className="block text-xs opacity-60">{c.country}</span>
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                          style={{
                            background: supported
                              ? 'color-mix(in srgb, var(--route) 14%, transparent)'
                              : 'color-mix(in srgb, var(--ink-2) 12%, transparent)',
                            color: supported ? 'var(--route-deep)' : 'var(--ink-2)',
                          }}
                        >
                          {supported ? 'Available' : 'Soon'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {notice && <p className="landing-notice">{notice}</p>}

            <div className="landing-chips">
              <span className="landing-chips-lbl">Jump to</span>
              {QUICK_CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="landing-chip"
                  onClick={() => pickChip(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LegendGrid />
    </div>
  )
}
