import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { City } from '../data/types'
import type { useViewer } from '../cesium/useViewer'
import { addPins, type PinHandle } from '../cesium/pins'
import { RideCamera } from '../cesium/rideCamera'
import { orbitAround, flyToStreetLevel } from '../cesium/camera'
import { useAppStore } from '../state/useAppStore'

interface TourModeProps {
  city: City
  viewer: ReturnType<typeof useViewer>
}

/** Normalize a stop's narration to an array of beats. */
function beatsFor(narration: string | string[]): string[] {
  return Array.isArray(narration) ? narration : [narration]
}

function ActionChip({
  onClick,
  children,
}: {
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-cocoa/15 bg-parchment/70 px-2.5 py-1 text-[11px] font-medium text-cocoa transition hover:border-cocoa/30 hover:bg-parchment active:scale-95"
    >
      {children}
    </button>
  )
}

export default function TourMode({ city, viewer }: TourModeProps) {
  const tour = city.tours[0]
  const [index, setIndex] = useState(0)
  const [beat, setBeat] = useState(0)
  const [traveling, setTraveling] = useState(false)
  const [phase, setPhase] = useState<'intro' | 'riding' | 'outro'>('intro')
  const [showFact, setShowFact] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const pinsRef = useRef<PinHandle | null>(null)
  const rideRef = useRef<RideCamera | null>(null)
  const orbitStopRef = useRef<(() => void) | null>(null)
  const selectMode = useAppStore((s) => s.selectMode)

  const stopOrbit = useCallback(() => {
    orbitStopRef.current?.()
    orbitStopRef.current = null
  }, [])

  const placeById = useCallback(
    (id: string) => city.places.find((p) => p.id === id),
    [city.places],
  )

  // Set up pins + the gliding ride camera once the viewer is ready.
  useEffect(() => {
    const v = viewer.viewerRef.current
    if (!viewer.ready || !v || !tour) return

    const handle = addPins(v, city.places, () => {})
    pinsRef.current = handle
    // The tour focuses on stops — only show the current stop's pin, not all POIs.
    handle.setVisibleIds([])

    const stopViews = tour.stops.map((s) => {
      const p = placeById(s.placeId)
      return {
        coord: { lat: p?.lat ?? 0, lng: p?.lng ?? 0 },
        view: s.view ?? p!.view,
      }
    })

    const ride = new RideCamera(v, tour.route, stopViews, {
      onArrive: (stopIndex) => {
        setTraveling(false)
        setBeat(0)
        setShowFact(false)
        const place = placeById(tour.stops[stopIndex].placeId)
        if (place) {
          // Show only this stop's pin.
          pinsRef.current?.setVisibleIds([place.id])
          pinsRef.current?.setSelected(place.id)
        }
      },
      onDepart: () => {
        setTraveling(true)
        // Hide all pins while gliding so the view stays clean.
        pinsRef.current?.setVisibleIds([])
        pinsRef.current?.setSelected(null)
      },
    })
    rideRef.current = ride
    ride.start()

    return () => {
      stopOrbit()
      ride.destroy()
      handle.destroy()
      rideRef.current = null
      pinsRef.current = null
    }
  }, [viewer.ready, viewer.viewerRef, tour, placeById, stopOrbit])

  // Advance forward: step through this stop's narration beats, then ride to
  // the next stop. Backward: previous beat, or previous stop.
  const advance = useCallback(() => {
    if (!tour || phase !== 'riding' || rideRef.current?.isTraveling()) return
    const stop = tour.stops[index]
    const beats = beatsFor(stop.narration)
    if (beat < beats.length - 1) {
      setBeat((b) => b + 1)
      return
    }
    if (index < tour.stops.length - 1) {
      stopOrbit()
      const next = index + 1
      setIndex(next)
      rideRef.current?.goToStop(next)
    } else {
      // Reached the end of the last stop's narration -> the journey is complete.
      setPhase('outro')
    }
  }, [tour, index, beat, phase, stopOrbit])

  const back = useCallback(() => {
    if (!tour || rideRef.current?.isTraveling()) return
    if (beat > 0) {
      setBeat((b) => b - 1)
      return
    }
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

  // Per-stop camera actions (the place's tuned view).
  const currentView = (() => {
    if (!tour) return undefined
    const s = tour.stops[index]
    return s.view ?? placeById(s.placeId)?.view
  })()

  const lookAround = useCallback(() => {
    const v = viewer.viewerRef.current
    if (!v || !currentView) return
    stopOrbit()
    orbitStopRef.current = orbitAround(v, currentView)
  }, [viewer.viewerRef, currentView, stopOrbit])

  const streetLevel = useCallback(() => {
    const v = viewer.viewerRef.current
    if (!v || !currentView) return
    stopOrbit()
    flyToStreetLevel(v, currentView)
  }, [viewer.viewerRef, currentView, stopOrbit])

  // Scroll wheel + arrow keys advance; ESC hops off into explore.
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

  // Auto-play: when on and parked at a stop, advance after a reading dwell.
  useEffect(() => {
    if (!autoPlay || phase !== 'riding' || traveling) return
    const t = window.setTimeout(() => advance(), 4200)
    return () => window.clearTimeout(t)
  }, [autoPlay, phase, traveling, index, beat, advance])

  // Stop auto-play when the journey ends.
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

  return (
    <>
      {/* Intro title card */}
      {viewer.ready && phase === 'intro' && (
        <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-ink/40 backdrop-blur-sm">
          <div className="max-w-md rounded-3xl border border-cocoa/20 bg-cream/97 p-8 text-center shadow-2xl animate-[fadeIn_0.4s_ease]">
            <div className="text-5xl">✈️</div>
            <h1 className="mt-3 font-display text-3xl font-bold text-ink">
              {tour.name}
            </h1>
            <p className="mt-3 text-cocoa">{tour.blurb}</p>
            <p className="mt-4 text-xs uppercase tracking-widest text-cocoa/70">
              {tour.stops.length} stops · a scenic Bay flyover
            </p>
            <button
              onClick={() => setPhase('riding')}
              className="mt-6 rounded-full bg-sunset px-6 py-3 text-sm font-semibold text-cream shadow-lg transition hover:bg-[#d9632d]"
            >
              ✈️ Take off →
            </button>
            <button
              onClick={() => selectMode('explore')}
              className="mt-3 block w-full text-xs text-cocoa transition hover:text-ink"
            >
              or roam the map yourself
            </button>
          </div>
        </div>
      )}

      {/* Journey-complete outro */}
      {viewer.ready && phase === 'outro' && (
        <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-ink/40 backdrop-blur-sm">
          <div className="max-w-md rounded-3xl border border-cocoa/20 bg-cream/97 p-8 text-center shadow-2xl animate-[fadeIn_0.4s_ease]">
            <div className="text-5xl">🛬</div>
            <h1 className="mt-3 font-display text-3xl font-bold text-ink">
              Coming in to land
            </h1>
            <p className="mt-3 text-cocoa">
              You flew the whole Bay — the bridge, the city, the coast, all{' '}
              {tour.stops.length} sights. Hope you got the lay of the land.
            </p>
            <button
              onClick={() => selectMode('explore')}
              className="mt-6 rounded-full bg-sunset px-6 py-3 text-sm font-semibold text-cream shadow-lg transition hover:bg-[#d9632d]"
            >
              Roam the map yourself →
            </button>
            <button
              onClick={() => {
                setPhase('riding')
                jumpTo(0)
              }}
              className="mt-3 block w-full text-xs text-cocoa transition hover:text-ink"
            >
              ride it again
            </button>
          </div>
        </div>
      )}

      {/* Route HUD, top-center */}
      {viewer.ready && phase === 'riding' && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
          <div className="rounded-full bg-cream/85 px-4 py-1.5 text-sm text-cocoa shadow-sm backdrop-blur">
            ✈️ {tour.name} · Stop {index + 1} of {tour.stops.length}
          </div>
          {/* Interactive route line — click a stop to glide there */}
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
                      i === index
                        ? 'h-3 w-3 scale-110 bg-sunset'
                        : i < index
                          ? 'h-2.5 w-2.5 bg-sage hover:scale-125'
                          : 'h-2.5 w-2.5 bg-cocoa/25 hover:scale-125 hover:bg-cocoa/50'
                    }`}
                  />
                  {i < tour.stops.length - 1 && (
                    <span
                      className={`h-0.5 w-4 ${i < index ? 'bg-sage' : 'bg-cocoa/20'}`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Auto-play toggle + hop-off hint, top-right */}
      {viewer.ready && phase === 'riding' && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <button
            onClick={() => setAutoPlay((a) => !a)}
            className={`pointer-events-auto rounded-full px-3 py-1.5 text-xs font-medium shadow-md backdrop-blur transition ${
              autoPlay
                ? 'bg-sunset text-cream'
                : 'bg-cream/90 text-cocoa hover:bg-cream'
            }`}
          >
            {autoPlay ? '⏸ Auto-playing' : '▶ Auto-play'}
          </button>
          <span className="pointer-events-none rounded-full bg-cream/80 px-3 py-1 text-xs text-cocoa shadow-sm backdrop-blur">
            ESC to hop off
          </span>
        </div>
      )}

      {/* Station card, bottom-center */}
      {viewer.ready && phase === 'riding' && (
        <div className="pointer-events-auto absolute bottom-6 left-1/2 z-20 w-[36rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-cocoa/20 bg-cream/95 shadow-xl backdrop-blur">
          <div className="flex">
            {place?.image && (
              <img
                src={place.image}
                alt={place.name}
                className="h-auto w-40 shrink-0 object-cover"
                onError={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.display = 'none')
                }
              />
            )}
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-cocoa">
                  {traveling ? (
                    <span className="animate-pulse">✈️ in flight…</span>
                  ) : (
                    <span>📍 now over</span>
                  )}
                </div>
                {beats.length > 1 && (
                  <div className="flex gap-1">
                    {beats.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1 w-4 rounded-full transition ${
                          i === beat ? 'bg-sunset' : 'bg-cocoa/20'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <h2 className="mt-0.5 font-display text-lg font-semibold leading-tight text-ink">
                {place?.name}
              </h2>

              <p
                key={`${index}-${beat}`}
                className="mt-1 min-h-[2.75rem] animate-[fadeIn_0.35s_ease] text-[13px] leading-snug text-cocoa"
              >
                {beats[beat]}
              </p>

              {/* Interactive: fun-fact reveal + tip (compact) */}
              {!traveling && (
                <div className="mt-1.5 space-y-1.5">
                  {stop.funFact &&
                    (showFact ? (
                      <div className="animate-[fadeIn_0.3s_ease] rounded-lg bg-sky/10 px-2.5 py-1.5 text-[11px] leading-snug text-sky">
                        💡 {stop.funFact}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowFact(true)}
                        className="text-[11px] font-medium text-sky transition hover:underline"
                      >
                        💡 Did you know? →
                      </button>
                    ))}
                  {lastBeat && stop.tip && (
                    <div className="rounded-lg bg-gold/10 px-2.5 py-1.5 text-[11px] leading-snug text-[#9a6a1f]">
                      ⭐ {stop.tip}
                    </div>
                  )}
                </div>
              )}

              {/* Camera action chips */}
              {!traveling && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <ActionChip onClick={lookAround}>🔄 Look around</ActionChip>
                  <ActionChip onClick={streetLevel}>🏙️ Street view</ActionChip>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={back}
                  disabled={atVeryStart || traveling}
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-cocoa transition enabled:hover:bg-parchment disabled:opacity-30"
                >
                  ← Back
                </button>
                <button
                  onClick={advance}
                  disabled={atVeryEnd || traveling}
                  className="rounded-full bg-sunset px-5 py-2 text-sm font-medium text-cream shadow transition enabled:hover:bg-[#d9632d] disabled:opacity-40"
                >
                  {atVeryEnd
                    ? 'Land ✈'
                    : traveling
                      ? 'In flight…'
                      : lastBeat
                        ? 'Next sight →'
                        : 'Continue →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
