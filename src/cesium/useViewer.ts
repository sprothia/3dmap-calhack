import { useEffect, useRef, useState } from 'react'
import * as Cesium from 'cesium'
import type { CameraView } from '../data/types'
import { cesiumIonToken, googleMapsKey } from './env'
import { setView } from './camera'
import { applyAtmosphere } from './atmosphere'

interface UseViewerResult {
  containerRef: React.RefObject<HTMLDivElement | null>
  viewerRef: React.RefObject<Cesium.Viewer | null>
  ready: boolean
  error: string | null
}

/**
 * Creates a single Cesium Viewer streaming Google Photorealistic 3D Tiles,
 * with the default globe/imagery and chrome widgets stripped for a clean look.
 * Frames the city's intro view once the tiles are ready.
 */
export function useViewer(intro: CameraView): UseViewerResult {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<Cesium.Viewer | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let cancelled = false
    let viewer: Cesium.Viewer | null = null

    Cesium.Ion.defaultAccessToken = cesiumIonToken
    Cesium.GoogleMaps.defaultApiKey = googleMapsKey

    async function init(container: HTMLDivElement) {
      const v = new Cesium.Viewer(container, {
        // The 3D tiles are the only thing we show — no default globe/imagery.
        globe: false,
        baseLayerPicker: false,
        // Strip the chrome for a clean, app-like canvas.
        timeline: false,
        animation: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        selectionIndicator: false,
        infoBox: false,
      })

      // With no globe, paint the empty sky in our warm cream instead of black.
      v.scene.backgroundColor = Cesium.Color.fromCssColorString('#FBF3E4')
      if (v.scene.skyAtmosphere) v.scene.skyAtmosphere.show = true
      v.cesiumWidget.creditContainer.classList.add('cesium-credit-hidden')

      // Make panning/zooming feel easy and responsive over the 3D tiles.
      const ctrl = v.scene.screenSpaceCameraController
      ctrl.enableCollisionDetection = true // don't let the camera fly underground
      ctrl.minimumZoomDistance = 60
      ctrl.maximumZoomDistance = 25000
      ctrl.inertiaZoom = 0.85
      ctrl.inertiaSpin = 0.85
      ctrl.inertiaTranslate = 0.85
      ctrl.zoomFactor = 6 // bigger zoom steps per wheel tick (default 5)

      // Explicit pinch-to-zoom + two-finger rotate (trackpad and touch).
      ctrl.zoomEventTypes = [
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH,
      ]
      ctrl.rotateEventTypes = [
        Cesium.CameraEventType.LEFT_DRAG,
      ]
      ctrl.tiltEventTypes = [
        Cesium.CameraEventType.RIGHT_DRAG,
        Cesium.CameraEventType.PINCH,
        {
          eventType: Cesium.CameraEventType.LEFT_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL,
        },
      ]
      ctrl.lookEventTypes = [
        {
          eventType: Cesium.CameraEventType.LEFT_DRAG,
          modifier: Cesium.KeyboardEventModifier.SHIFT,
        },
      ]

      if (cancelled) {
        v.destroy()
        return
      }
      viewer = v
      viewerRef.current = v

      // Frame the intro immediately so something is visible before tiles stream.
      setView(v, intro)

      try {
        const tileset = await Cesium.createGooglePhotorealistic3DTileset({
          onlyUsingWithGoogleGeocoder: true,
        })
        if (cancelled || v.isDestroyed()) {
          tileset.destroy()
          return
        }
        v.scene.primitives.add(tileset)
        applyAtmosphere(v)
        // Re-apply the intro now that real geometry exists, then reveal.
        setView(v, intro)
        setReady(true)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
      }
    }

    void init(containerRef.current)

    return () => {
      cancelled = true
      if (viewer && !viewer.isDestroyed()) viewer.destroy()
      viewerRef.current = null
    }
    // Create the viewer once; intro is stable per city.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { containerRef, viewerRef, ready, error }
}
