import type { useViewer } from '../cesium/useViewer'
import { zoomBy } from '../cesium/camera'

/** On-screen +/- zoom buttons, bottom-right. Works in both modes. */
export default function ZoomControls({
  viewer,
}: {
  viewer: ReturnType<typeof useViewer>
}) {
  const zoom = (factor: number) => {
    const v = viewer.viewerRef.current
    if (v) zoomBy(v, factor)
  }

  return (
    <div className="pointer-events-auto absolute bottom-6 right-4 z-20 flex flex-col overflow-hidden rounded-full bg-cream/90 shadow-md backdrop-blur">
      <button
        onClick={() => zoom(0.55)}
        aria-label="Zoom in"
        className="px-3.5 py-2 text-lg text-ink transition hover:bg-parchment"
      >
        +
      </button>
      <div className="mx-2 h-px bg-cocoa/15" />
      <button
        onClick={() => zoom(1.8)}
        aria-label="Zoom out"
        className="px-3.5 py-2 text-lg text-ink transition hover:bg-parchment"
      >
        −
      </button>
    </div>
  )
}
