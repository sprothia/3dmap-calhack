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

function MapCanvas({ city, children }: MapViewProps) {
  const viewer = useViewer(city.intro)
  const back = useAppStore((s) => s.back)

  return (
    <div className="relative h-full w-full">
      <div ref={viewer.containerRef} className="absolute inset-0" />

      {/* Top-left exit + city label */}
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-3">
        <button
          onClick={back}
          className="pointer-events-auto rounded-full bg-cream/90 px-4 py-2 text-sm font-medium text-ink shadow-md backdrop-blur transition hover:bg-cream"
        >
          ← Exit
        </button>
        <span className="pointer-events-none rounded-full bg-cream/80 px-3 py-1 text-sm text-cocoa shadow-sm backdrop-blur">
          {city.name}
        </span>
      </div>

      {/* Atmospheric loading screen until tiles arrive */}
      {!viewer.ready && !viewer.error && (
        <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-b from-[#F4C58A] via-cream to-[#C9A6C8]">
          <div className="text-5xl">🌁</div>
          <p className="mt-4 font-display text-2xl text-ink">Pouring the Bay…</p>
          <p className="mt-1 text-sm text-cocoa">Letting the fog settle in</p>
          <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-cocoa/15">
            <div className="h-full w-1/2 animate-[fog-drift_1.4s_ease-in-out_infinite] rounded-full bg-sunset" />
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
