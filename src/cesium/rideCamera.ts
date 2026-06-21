import * as Cesium from 'cesium'
import type { CameraView, RoutePoint } from '../data/types'
import { Route } from './route'

interface RideCallbacks {
  onArrive: (stopIndex: number) => void
  onDepart?: (stopIndex: number) => void
  onProgress?: (p: number) => void
}

// Framing while flying between stops — an aerial, plane-window feel:
// higher up, further back, looking down at the city sliding past below.
const RIDE_ALT = 850 // meters above the route point
const RIDE_BACK = 700 // meters behind along the travel direction
const RIDE_PITCH = -30 // degrees

function easeInOut(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
}

interface Stop {
  t: number
  view: CameraView
}

/**
 * Drives the CAMERA in two phases per stop:
 *  1) glide continuously along the route spline (riding framing), then
 *  2) settle onto the place's own tuned view and gently push in (arrival).
 * No 3D model — it's all camera.
 */
export class RideCamera {
  private viewer: Cesium.Viewer
  private route: Route
  private cb: RideCallbacks
  private stops: Stop[]
  private currentT: number
  private raf = 0
  private traveling = false

  constructor(
    viewer: Cesium.Viewer,
    routePoints: RoutePoint[],
    stopViews: { coord: RoutePoint; view: CameraView }[],
    cb: RideCallbacks,
  ) {
    this.viewer = viewer
    this.cb = cb
    this.route = new Route(routePoints)
    this.stops = stopViews.map((s) => ({
      t: this.route.fractionNearest(s.coord.lat, s.coord.lng),
      view: s.view,
    }))
    this.currentT = this.stops[0]?.t ?? 0
  }

  start() {
    this.settleOnView(this.stops[0]?.view, 2).then(() => this.cb.onArrive(0))
  }

  isTraveling() {
    return this.traveling
  }

  goToStop(index: number) {
    const stop = this.stops[index]
    if (!stop || this.traveling) return
    const fromT = this.currentT
    const toT = stop.t
    const span = Math.abs(toT - fromT)
    // Travel covers ~85% of the way; the final approach is the settle/push-in.
    const glideTo = fromT + (toT - fromT) * 0.85
    const duration = Cesium.Math.clamp(2000 + span * 13000, 2400, 6500)

    this.traveling = true
    this.cb.onDepart?.(index)
    const t0 = performance.now()

    const step = (now: number) => {
      const p = Cesium.Math.clamp((now - t0) / duration, 0, 1)
      this.currentT = fromT + (glideTo - fromT) * easeInOut(p)
      this.applyRideCamera(this.currentT)
      this.cb.onProgress?.(p)

      if (p < 1) {
        this.raf = requestAnimationFrame(step)
      } else {
        this.currentT = toT
        // Phase 2: settle onto the place's view, then push in.
        this.settleOnView(stop.view, 2.2).then(() => {
          this.traveling = false
          this.cb.onArrive(index)
        })
      }
    }
    cancelAnimationFrame(this.raf)
    this.raf = requestAnimationFrame(step)
  }

  /** Camera floats above & behind the line, looking forward (the "riding" feel). */
  private applyRideCamera(t: number) {
    const ground = this.route.positionAt(t)
    const heading = this.route.headingAt(t)
    const carto = Cesium.Cartographic.fromCartesian(ground)

    const enu = Cesium.Transforms.headingPitchRollToFixedFrame(
      Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, 0),
      new Cesium.HeadingPitchRoll(heading, 0, 0),
    )
    const offset = new Cesium.Cartesian3(0, -RIDE_BACK, RIDE_ALT)
    const destination = Cesium.Matrix4.multiplyByPoint(enu, offset, new Cesium.Cartesian3())
    this.viewer.camera.setView({
      destination,
      orientation: { heading, pitch: Cesium.Math.toRadians(RIDE_PITCH), roll: 0 },
    })
  }

  /**
   * Fly to a place's tuned view (centered on the spot), then slowly push in.
   * Returns a promise that resolves when the push-in finishes.
   */
  private settleOnView(view: CameraView | undefined, flyDuration: number): Promise<void> {
    if (!view) return Promise.resolve()
    const target = Cesium.Cartesian3.fromDegrees(view.lng, view.lat)
    const headingRad = Cesium.Math.toRadians(view.heading)
    const pitchRad = Cesium.Math.toRadians(view.pitch)

    return new Promise((resolve) => {
      this.viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(target, 1), {
        offset: new Cesium.HeadingPitchRange(headingRad, pitchRad, view.height),
        duration: flyDuration,
        complete: () => this.pushIn(target, headingRad, pitchRad, view.height, resolve),
        cancel: () => resolve(),
      })
    })
  }

  /** Gentle dolly-in: shrink the viewing range ~22% over ~1.6s. */
  private pushIn(
    target: Cesium.Cartesian3,
    heading: number,
    pitch: number,
    range: number,
    done: () => void,
  ) {
    const fromR = range
    const toR = range * 0.78
    const dur = 1600
    const t0 = performance.now()
    const sphere = new Cesium.BoundingSphere(target, 1)

    const step = (now: number) => {
      const p = Cesium.Math.clamp((now - t0) / dur, 0, 1)
      const r = fromR + (toR - fromR) * easeInOut(p)
      this.viewer.camera.lookAt(target, new Cesium.HeadingPitchRange(heading, pitch, r))
      if (p < 1) {
        this.raf = requestAnimationFrame(step)
      } else {
        // Release the lookAt transform so the user can orbit freely afterward.
        this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        void sphere
        done()
      }
    }
    cancelAnimationFrame(this.raf)
    this.raf = requestAnimationFrame(step)
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    // Make sure no lookAt transform is left applied.
    if (!this.viewer.isDestroyed()) {
      this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    }
  }
}
