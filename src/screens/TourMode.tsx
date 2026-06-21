import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { City } from '../data/types'
import type { useViewer } from '../cesium/useViewer'
import { addPins, type PinHandle } from '../cesium/pins'
import { RideCamera } from '../cesium/rideCamera'
import { orbitAround, flyToStreetLevel } from '../cesium/camera'
import { useAppStore } from '../state/useAppStore'
import { CATEGORY_CHIP, CATEGORY_LABEL } from '../data/categories'
import AreaInfoSidebar from '../components/AreaInfoSidebar'
import ImageGallery from '../components/ImageGallery'

interface TourModeProps {
  city: City
  viewer: ReturnType<typeof useViewer>
}

function beatsFor(narration: string | string[]): string[] {
  return Array.isArray(narration) ? narration : [narration]
}

function ActionChip({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-cocoa/15 bg-parchment/70 px-2.5 py-1 text-[11px] font-medium text-cocoa transition hover:border-cocoa/30 hover:bg-parchment active:scale-95"
    >
      {children}
    </button>
  )
}

function MiniTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 px-2.5 py-1.5 text-[12px] font-medium transition ${
        active ? 'border-sunset text-ink' : 'border-transparent text-cocoa/60 hover:text-cocoa'
      }`}
    >
      {children}
    </button>
  )
}

// Speed lines for the flight overlay
const SPEED_LINES = Array.from({ length: 18 }, (_, i) => ({
  top: `${5 + (i / 18) * 90}%`,
  width: `${60 + Math.sin(i * 2.3) * 30}px`,
  delay: `${(i * 0.11) % 1.2}s`,
  duration: `${0.6 + (i % 5) * 0.13}s`,
  opacity: 0.15 + (i % 3) * 0.12,
}))

type StopTab = 'overview' | 'details' | 'nearby'

export default function TourMode({ city, viewer }: TourModeProps) {
  const tour = city.tours[0]
  const [index, setIndex] = useState(0)
  const [beat, setBeat] = useState(0)
  const [traveling, setTraveling] = useState(false)
  const [phase, setPhase] = useState<'intro' | 'riding' | 'outro'>('intro')
  const [showFact, setShowFact] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [stopTab, setStopTab] = useState<StopTab>('overview')
  const [cardHidden, setCardHidden] = useState(false)
  const [flightProgress, setFlightProgress] = useState(0)
  const pinsRef = useRef<PinHandle | null>(null)
  const rideRef = useRef<RideCamera | null>(null)
  const orbitStopRef = useRef<(() => void) | null>(null)
  const flightTimerRef = useRef<number | null>(null)
  const selectMode = useAppStore((s) => s.selectMode)

  const stopOrbit = useCallback(() => {
    orbitStopRef.current?.()
    orbitStopRef.current = null
  }, [])

  const placeById = useCallback(
    (id: string) => city.places.find((p) => p.id === id),
    [city.places],
  )

  useEffect(() => {
    const v = viewer.viewerRef.current
    if (!viewer.ready || !v || !tour) return

    const handle = addPins(v, city.places, () => {})
    pinsRef.current = handle
    handle.setVisibleIds([])

    const stopViews = tour.stops.map((s) => {
      const p = placeById(s.placeId)
      return { coord: { lat: p?.lat ?? 0, lng: p?.lng ?? 0 }, view: s.view ?? p!.view }
    })

    const ride = new RideCamera(v, tour.route, stopViews, {
      onArrive: (stopIndex) => {
        setTraveling(false)
        setBeat(0)
        setShowFact(false)
        setStopTab('overview')
        setCardHidden(false)
        setFlightProgress(0)
        if (flightTimerRef.current) {
          window.clearInterval(flightTimerRef.current)
          flightTimerRef.current = null
        }
        const place = placeById(tour.stops[stopIndex].placeId)
        if (place) {
          pinsRef.current?.setVisibleIds([place.id])
          pinsRef.current?.setSelected(place.id)
        }
      },
      onDepart: () => {
        setTraveling(true)
        setFlightProgress(0)
        pinsRef.current?.setVisibleIds([])
        pinsRef.current?.setSelected(null)
        const start = Date.now()
        const duration = 5500
        flightTimerRef.current = window.setInterval(() => {
          const pct = Math.min((Date.now() - start) / duration, 1)
          setFlightProgress(pct)
          if (pct >= 1 && flightTimerRef.current) {
            window.clearInterval(flightTimerRef.current)
            flightTimerRef.current = null
          }
        }, 50)
      },
    })
    rideRef.current = ride
    ride.start()

    return () => {
      stopOrbit()
      ride.destroy()
      handle.destroy()
      if (flightTimerRef.current) window.clearInterval(flightTimerRef.current)
      rideRef.current = null
      pinsRef.current = null
    }
  }, [viewer.ready, viewer.viewerRef, tour, placeById, stopOrbit])

  const advance = useCallback(() => {
    if (!tour || phase !== 'riding' || rideRef.current?.isTraveling()) return
    const stop = tour.stops[index]
    const beats = beatsFor(stop.narration)
    if (beat < beats.length - 1) { setBeat((b) => b + 1); return }
    if (index < tour.stops.length - 1) {
      stopOrbit()
      const next = index + 1
      setIndex(next)
      rideRef.current?.goToStop(next)
    } else {
      setPhase('outro')
    }
  }, [tour, index, beat, phase, stopOrbit])

  const back = useCallback(() => {
    if (!tour || rideRef.current?.isTraveling()) return
    if (beat > 0) { setBeat((b) => b - 1); return }
    if (index > 0) {
      stopOrbit()
      const prev = index - 1
      setIndex(prev)
      rideRef.current?.goToStop(prev)
    }
  }, [tour, index, beat, stopOrbit])

  const jumpTo = useCallback(
    (target: number) => {
      if (!tour || rideRef.current?.isTraveling() || target === index) return
      stopOrbit()
      setIndex(target)
      rideRef.current?.goToStop(target)
    },
    [tour, index, stopOrbit],
  )

  const currentView = (() => {
    if (!tour) return undefined
    const s = tour.stops[index]
    return s.view ?? placeById(s.placeId)?.view
  })()

  const lookAround = useCallback(() => {
    const v = viewer.viewerRef.current
    if (!v || !currentView) return
    stopOrbit()
    setCardHidden(true)
    orbitStopRef.current = orbitAround(v, currentView)
  }, [viewer.viewerRef, currentView, stopOrbit])

  const streetLevel = useCallback(() => {
    const v = viewer.viewerRef.current
    if (!v || !currentView) return
    stopOrbit()
    setCardHidden(true)
    flyToStreetLevel(v, currentView)
  }, [viewer.viewerRef, currentView, stopOrbit])

  useEffect(() => {
    let wheelLock = false
    const onWheel = (e: WheelEvent) => {
      if (wheelLock || phase !== 'riding' || rideRef.current?.isTraveling()) return
      if (Math.abs(e.deltaY) < 20) return
      wheelLock = true
      if (e.deltaY > 0) advance()
      else back()
      window.setTimeout(() => (wheelLock = false), 600)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectMode('explore')
      if (phase !== 'riding') return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') advance()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') back()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [advance, back, selectMode])

  useEffect(() => {
    if (!autoPlay || phase !== 'riding' || traveling) return
    const t = window.setTimeout(() => advance(), 4200)
    return () => window.clearTimeout(t)
  }, [autoPlay, phase, traveling, index, beat, advance])

  useEffect(() => {
    if (phase === 'outro') setAutoPlay(false)
  }, [phase])

  if (!tour) {
    return (
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full bg-cream/90 px-4 py-2 text-sm text-cocoa shadow">
        No tour available for this city yet.
      </div>
    )
  }

  const stop = tour.stops[index]
  const place = placeById(stop.placeId)
  const beats = beatsFor(stop.narration)
  const lastBeat = beat >= beats.length - 1
  const atLastStop = index === tour.stops.length - 1
  const atVeryStart = index === 0 && beat === 0
  const atVeryEnd = atLastStop && lastBeat
  // While traveling, `index` is ALREADY the destination stop (advance() set it
  // before goToStop). So the place we're flying toward is the current stop.
  const destPlace = placeById(stop.placeId)

  const allImages = [
    ...(place?.image ? [place.image] : []),
    ...(place?.images ?? []),
  ]

  return (
    <>
      {/* Intro */}
      {viewer.ready && phase === 'intro' && (
        <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-ink/75 backdrop-blur-md">
          <div
            className="relative w-[28rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[2rem] bg-cream shadow-2xl ring-1 ring-black/10"
            style={{ animation: 'popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            {/* Sleek flight banner — gradient sky, drawn flight arc, skyline */}
            <div className="relative h-32 overflow-hidden bg-gradient-to-b from-[#bcdcf6] via-[#d6ecf8] to-[#f6ecd8]">
              <svg
                viewBox="0 0 448 128"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
              >
                {/* soft sun */}
                <circle cx="392" cy="34" r="22" fill="#FBE3A6" opacity="0.85" />
                {/* flat modern clouds */}
                <g fill="#ffffff" opacity="0.92">
                  <g style={{ animation: 'tourCloud 16s linear infinite' }}>
                    <ellipse cx="90" cy="40" rx="34" ry="13" />
                    <ellipse cx="112" cy="33" rx="22" ry="14" />
                  </g>
                  <g style={{ animation: 'tourCloud 22s linear infinite', opacity: 0.8 }}>
                    <ellipse cx="300" cy="64" rx="28" ry="11" />
                    <ellipse cx="318" cy="58" rx="18" ry="12" />
                  </g>
                </g>
                {/* dashed flight arc */}
                <path
                  d="M22 104 Q150 18 432 52"
                  fill="none"
                  stroke="#E8743B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="3 8"
                  opacity="0.9"
                  style={{ animation: 'dashFlow 1.4s linear infinite' }}
                />
                {/* plane riding the arc */}
                <g style={{ animation: 'tourPlane 5s ease-in-out infinite' }}>
                  <path
                    d="M0 -7 L9 5 L0 1.8 L-9 5 Z"
                    fill="#2F2A24"
                    transform="translate(300 44) rotate(28)"
                  />
                </g>
                {/* skyline silhouette */}
                <path
                  d="M0 128 V112 H22 V96 H34 V104 H52 V84 H64 V104 H86 V92 H96 V72 H108 V104 H132 V98 H150 V108 H176 V88 H188 V108 H214 V100 H230 V78 H242 V108 H300 V94 H316 V108 H344 V82 H356 V108 H392 V96 H410 V108 H448 V128 Z"
                  fill="#2F2A24"
                  opacity="0.22"
                />
              </svg>
            </div>

            <div className="px-8 pb-8 pt-6 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sunset">
                Guided flight
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold text-ink">
                {tour.name}
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-cocoa">
                {tour.blurb}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-cocoa">
                <span className="rounded-full bg-parchment px-3 py-1">
                  {tour.stops.length} stops
                </span>
                <span className="rounded-full bg-parchment px-3 py-1">
                  ~5 min
                </span>
                <span className="rounded-full bg-parchment px-3 py-1">
                  scenic flyover
                </span>
              </div>

              <button
                onClick={() => setPhase('riding')}
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-sunset px-8 py-3.5 text-base font-bold text-cream shadow-lg shadow-sunset/30 transition hover:bg-[#d9632d] hover:shadow-xl hover:shadow-sunset/40 active:scale-95"
              >
                <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">
                  ✈️
                </span>
                Take off
              </button>
              <button
                onClick={() => selectMode('explore')}
                className="mt-3 block w-full text-xs text-cocoa/70 transition hover:text-ink"
              >
                or roam the map yourself
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Outro */}
      {viewer.ready && phase === 'outro' && (
        <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-ink/75 backdrop-blur-md">
          <div
            className="w-[28rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[2rem] bg-cream p-8 text-center shadow-2xl ring-1 ring-black/10"
            style={{ animation: 'popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            <div className="text-5xl" style={{ animation: 'planeBob 2.5s ease-in-out infinite' }}>🛬</div>
            <h1 className="mt-3 font-display text-3xl font-bold text-ink">Coming in to land</h1>
            <p className="mt-3 text-cocoa">
              You flew the whole Bay — the bridge, the city, the coast, all {tour.stops.length} sights.
            </p>
            <button
              onClick={() => selectMode('explore')}
              className="mt-6 rounded-full bg-sunset px-6 py-3 text-sm font-semibold text-cream shadow-lg transition hover:bg-[#d9632d] active:scale-95"
            >
              Roam the map yourself →
            </button>
            <button onClick={() => { setPhase('riding'); jumpTo(0) }} className="mt-3 block w-full text-xs text-cocoa transition hover:text-ink">
              ride it again
            </button>
          </div>
        </div>
      )}

      {/* ── RIDING ── */}
      {viewer.ready && phase === 'riding' && (
        <>
          {/* Route HUD top-center */}
          <div className="pointer-events-none absolute left-1/2 top-4 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
            <div className="rounded-full bg-cream/85 px-4 py-1.5 text-sm text-cocoa shadow-sm backdrop-blur">
              ✈️ {tour.name} · Stop {index + 1} of {tour.stops.length}
            </div>
            <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-cream/70 px-3 py-1.5 shadow-sm backdrop-blur">
              {tour.stops.map((s, i) => {
                const p = placeById(s.placeId)
                return (
                  <div key={s.placeId} className="flex items-center">
                    <button
                      title={p?.name}
                      onClick={() => jumpTo(i)}
                      disabled={traveling}
                      className={`rounded-full transition disabled:cursor-default ${
                        i === index ? 'h-3 w-3 scale-110 bg-sunset'
                          : i < index ? 'h-2.5 w-2.5 bg-sage hover:scale-125'
                          : 'h-2.5 w-2.5 bg-cocoa/25 hover:scale-125 hover:bg-cocoa/50'
                      }`}
                    />
                    {i < tour.stops.length - 1 && (
                      <span className={`h-0.5 w-4 ${i < index ? 'bg-sage' : 'bg-cocoa/20'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top-right controls */}
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
            <button
              onClick={() => setAutoPlay((a) => !a)}
              className={`pointer-events-auto rounded-full px-3 py-1.5 text-xs font-medium shadow-md backdrop-blur transition ${
                autoPlay ? 'bg-sunset text-cream' : 'bg-cream/90 text-cocoa hover:bg-cream'
              }`}
            >
              {autoPlay ? '⏸ Auto-playing' : '▶ Auto-play'}
            </button>
            <span className="pointer-events-none rounded-full bg-cream/80 px-3 py-1 text-xs text-cocoa shadow-sm backdrop-blur">
              ESC to hop off
            </span>
          </div>

          {/* ── CINEMATIC FLIGHT OVERLAY ── */}
          {traveling && (
            <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
              {/* Dark backdrop */}
              <div className="absolute inset-0 bg-ink/65 backdrop-blur-[2px]" />

              {/* Speed lines streaming left-to-right */}
              <div className="absolute inset-0">
                {SPEED_LINES.map((line, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 h-px bg-cream/80 rounded-full"
                    style={{
                      top: line.top,
                      opacity: line.opacity,
                      animation: `speedLine ${line.duration} linear ${line.delay} infinite`,
                      width: line.width,
                    }}
                  />
                ))}
              </div>

              {/* Radar rings expanding from center */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border border-sunset/40"
                    style={{
                      animation: `radarPulse 2.5s ease-out ${i * 0.5}s infinite`,
                      width: 0,
                      height: 0,
                    }}
                  />
                ))}
                {/* Radar sweep line */}
                <div
                  className="absolute w-32 h-px origin-left"
                  style={{
                    background: 'linear-gradient(to right, transparent, rgba(232,71,59,0.6))',
                    animation: 'scanSweep 3s linear infinite',
                    transformOrigin: '0 50%',
                  }}
                />
              </div>

              {/* Center content */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ animation: 'fadeInPlace 0.6s ease both' }}
              >
                {/* Plane icon */}
                <div
                  className="text-5xl mb-6"
                  style={{ animation: 'planePulse 2s ease-in-out infinite' }}
                >
                  ✈️
                </div>

                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-cream/50 mb-2">
                  Now flying to
                </p>

                <h2 className="font-display text-4xl font-bold text-cream text-center px-8 drop-shadow-lg">
                  {destPlace?.name ?? 'next stop'}
                </h2>

                {stop.flyingOver && (
                  <p className="mt-2 text-[13px] text-cream/60">
                    passing over {stop.flyingOver}
                  </p>
                )}

                {/* Destination preview card */}
                {destPlace && (
                  <div
                    className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/8 px-5 py-3 backdrop-blur-sm max-w-sm w-full mx-4"
                    style={{ animation: 'fadeInPlace 0.8s ease 0.3s both' }}
                  >
                    {destPlace.image && (
                      <img
                        src={destPlace.image}
                        alt={destPlace.name}
                        className="h-14 w-20 shrink-0 rounded-xl object-cover border border-white/10"
                        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-cream/50">Destination</p>
                      <p className="mt-0.5 font-semibold text-cream text-[15px] leading-tight">{destPlace.name}</p>
                      <p className="mt-0.5 text-[12px] text-cream/60 line-clamp-1">{destPlace.blurb}</p>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div className="mt-6 w-64 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-sunset rounded-full transition-all duration-100"
                    style={{ width: `${flightProgress * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-[10px] text-cream/40 uppercase tracking-widest">
                  {Math.round(flightProgress * 100)}% · {Math.round((1 - flightProgress) * 5)}s remaining
                </p>
              </div>
            </div>
          )}

          {/* Area info sidebar — shown when parked */}
          {!traveling && stop.areaInfo && (
            <AreaInfoSidebar area={stop.areaInfo} />
          )}

          {/* Pop the card back up after Look around / Street view */}
          {!traveling && cardHidden && (
            <button
              onClick={() => setCardHidden(false)}
              className="pointer-events-auto absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink shadow-lg ring-1 ring-black/5 transition hover:-translate-y-0.5 active:scale-95"
              style={{ animation: 'fadeInPlace 0.3s ease both' }}
            >
              <span className="text-base">↑</span>
              {place?.name ?? 'Show details'}
            </button>
          )}

          {/* ── STATION CARD (parked) ── */}
          {!traveling && !cardHidden && (
            <div className="pointer-events-auto absolute bottom-6 left-1/2 z-20 w-[42rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-cocoa/20 bg-cream/95 shadow-xl backdrop-blur">
              {/* Image gallery */}
              {allImages.length > 0 && (
                <ImageGallery images={allImages} alt={place?.name ?? ''} className="h-40 w-full" />
              )}

              <div className="px-4 pt-3 pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {place && (
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${CATEGORY_CHIP[place.category]}`}>
                          {CATEGORY_LABEL[place.category]}
                        </span>
                      )}
                      <span className="text-[11px] text-cocoa/60">Stop {index + 1} of {tour.stops.length}</span>
                    </div>
                    <h2 className="mt-1 font-display text-lg font-semibold leading-tight text-ink">{place?.name}</h2>
                  </div>
                  {beats.length > 1 && (
                    <div className="flex gap-1 shrink-0 mt-1">
                      {beats.map((_, i) => (
                        <span key={i} className={`h-1 w-4 rounded-full transition ${i === beat ? 'bg-sunset' : 'bg-cocoa/20'}`} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {place?.tags && place.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {place.tags.map((t) => (
                      <span key={t.label} className="rounded-full bg-parchment border border-cocoa/10 px-2 py-0.5 text-[10px] font-medium text-cocoa">
                        {t.emoji} {t.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Sub-tabs */}
              <div className="flex gap-0.5 border-b border-cocoa/10 px-4 mt-2">
                <MiniTab active={stopTab === 'overview'} onClick={() => setStopTab('overview')}>Overview</MiniTab>
                {(place?.history || (place?.stats?.length ?? 0) > 0) && (
                  <MiniTab active={stopTab === 'details'} onClick={() => setStopTab('details')}>Details</MiniTab>
                )}
                {(place?.nearby?.length ?? 0) > 0 && (
                  <MiniTab active={stopTab === 'nearby'} onClick={() => setStopTab('nearby')}>Nearby</MiniTab>
                )}
              </div>

              {/* Tab content */}
              <div className="px-4 py-2.5 text-[13px] text-cocoa max-h-40 overflow-y-auto">
                {stopTab === 'overview' && (
                  <div className="space-y-2">
                    <p key={`${index}-${beat}`} className="leading-snug" style={{ animation: 'fadeInPlace 0.35s ease both' }}>
                      {beats[beat]}
                    </p>
                    {stop.funFact && (
                      showFact ? (
                        <div className="rounded-lg bg-sky/10 px-2.5 py-1.5 text-[11px] leading-snug text-sky" style={{ animation: 'fadeInPlace 0.3s ease both' }}>
                          💡 {stop.funFact}
                        </div>
                      ) : (
                        <button onClick={() => setShowFact(true)} className="text-[11px] font-medium text-sky transition hover:underline">
                          💡 Did you know? →
                        </button>
                      )
                    )}
                    {lastBeat && stop.tip && (
                      <div className="rounded-lg bg-gold/10 px-2.5 py-1.5 text-[11px] leading-snug text-[#9a6a1f]">
                        ⭐ {stop.tip}
                      </div>
                    )}
                  </div>
                )}

                {stopTab === 'details' && (
                  <div className="space-y-2">
                    {place?.history && <p className="leading-snug">{place.history}</p>}
                    {place?.stats && place.stats.length > 0 && (
                      <dl className="overflow-hidden rounded-xl border border-cocoa/10">
                        {place.stats.map((s, i) => (
                          <div key={s.label} className={`flex justify-between px-3 py-1.5 text-[12px] ${i % 2 ? 'bg-parchment/40' : 'bg-parchment/20'}`}>
                            <dt className="text-cocoa/70">{s.label}</dt>
                            <dd className="font-semibold text-ink">{s.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                )}

                {stopTab === 'nearby' && place?.nearby && (
                  <div className="space-y-2">
                    {place.nearby.map((n) => (
                      <div key={n.name} className="rounded-xl border border-cocoa/10 bg-parchment/40 px-3 py-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[13px] font-semibold text-ink">{n.name}</p>
                          <span className="text-[11px] text-cocoa/60">{n.distance}</span>
                        </div>
                        <p className="mt-0.5 text-[12px] text-cocoa/80 leading-snug">{n.whyVisit}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-cocoa/10 px-4 py-2.5">
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  <ActionChip onClick={lookAround}>🔄 Look around</ActionChip>
                  <ActionChip onClick={streetLevel}>🏙️ Street view</ActionChip>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={back}
                    disabled={atVeryStart}
                    className="rounded-full px-3 py-1.5 text-sm font-medium text-cocoa transition enabled:hover:bg-parchment disabled:opacity-30"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={advance}
                    disabled={atVeryEnd}
                    className="rounded-full bg-sunset px-5 py-2 text-sm font-medium text-cream shadow transition enabled:hover:bg-[#d9632d] disabled:opacity-40"
                  >
                    {atVeryEnd ? 'Land ✈' : lastBeat ? 'Next sight →' : 'Continue →'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
