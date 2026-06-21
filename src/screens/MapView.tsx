import type { ReactNode } from 'react'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import type { City } from '../data/types'
import { hasMapKeys } from '../cesium/env'
import { useViewer } from '../cesium/useViewer'
import { useAppStore } from '../state/useAppStore'
import MissingKeys from '../components/MissingKeys'
import Fog from '../components/Fog'
import ZoomControls from '../components/ZoomControls'

interface MapViewProps {
  city: City
  /** Overlays (pins, panels, narration) rendered above the canvas. */
  children?: (viewer: ReturnType<typeof useViewer>) => ReactNode
}

// Twinkling "city lights" sprinkled on the loading screen.
const LOADING_DOTS = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53 + 13) % 100}%`,
  dur: 2 + (i % 4) * 0.6,
  delay: `${(i % 6) * 0.3}s`,
}))

function MapCanvas({ city, children }: MapViewProps) {
  const viewer = useViewer(city.intro)
  const back = useAppStore((s) => s.back)
  const goHome = useAppStore((s) => s.reset)

  return (
    <div className="relative h-full w-full">
      <div ref={viewer.containerRef} className="absolute inset-0" />

      {/* Nav — pinned bottom-left at a high z so overlays never cover it */}
      <div className="pointer-events-none absolute bottom-6 left-4 z-50 flex items-center gap-2">
        <button
          onClick={goHome}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-cream px-4 py-2.5 text-sm font-semibold text-ink shadow-lg ring-1 ring-black/5 transition hover:-translate-x-0.5 hover:bg-parchment"
        >
          ← Home
        </button>
        <button
          onClick={back}
          className="pointer-events-auto rounded-full bg-cream/90 px-4 py-2.5 text-sm font-medium text-cocoa shadow-lg ring-1 ring-black/5 backdrop-blur transition hover:bg-cream"
        >
          Switch mode
        </button>
      </div>

      {/* Atmospheric loading screen until tiles arrive */}
      {!viewer.ready && !viewer.error && (
        <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1e2a3a] via-[#3a4a63] to-[#7fa8c9]">
          {/* Drifting fog layers */}
          <div className="absolute inset-0 opacity-70">
            <div
              className="absolute bottom-0 left-0 h-1/2 w-[200%] bg-gradient-to-t from-white/30 to-transparent blur-2xl"
              style={{ animation: 'cloudDrift 7s linear infinite' }}
            />
            <div
              className="absolute bottom-10 left-0 h-1/3 w-[200%] bg-gradient-to-t from-white/20 to-transparent blur-2xl"
              style={{ animation: 'cloudDrift 11s linear infinite reverse' }}
            />
          </div>
          {/* Twinkling lights */}
          <div className="absolute inset-0">
            {LOADING_DOTS.map((d, i) => (
              <span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-gold/70"
                style={{
                  left: d.left,
                  top: d.top,
                  animation: `planeBob ${d.dur}s ease-in-out infinite`,
                  animationDelay: d.delay,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className="text-6xl drop-shadow-2xl"
              style={{ animation: 'floatSlow 3s ease-in-out infinite' }}
            >
              🌁
            </div>
            <p className="mt-5 font-display text-3xl font-bold text-white drop-shadow">
              Pouring the Bay
            </p>
            <p className="mt-1.5 text-sm text-white/70">
              streaming the city, settling the fog…
            </p>
            <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full w-1/3 rounded-full bg-gradient-to-r from-sunset to-gold"
                style={{ animation: 'loaderSlide 1.3s ease-in-out infinite' }}
              />
            </div>
          </div>
        </div>
      )}

      {viewer.error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-cream/95 px-6 text-center">
          <div>
            <p className="font-display text-2xl text-ink">The map couldn’t load</p>
            <p className="mt-2 max-w-md text-sm text-cocoa">{viewer.error}</p>
            <p className="mt-2 text-sm text-cocoa">
              Double-check your keys and that the Map Tiles API is enabled.
            </p>
          </div>
        </div>
      )}

      {children?.(viewer)}

      {/* Shared across both modes. */}
      {viewer.ready && (
        <>
          <Fog />
          <ZoomControls viewer={viewer} />
        </>
      )}
    </div>
  )
}

export default function MapView(props: MapViewProps) {
  if (!hasMapKeys) return <MissingKeys />
  return <MapCanvas {...props} />
}
