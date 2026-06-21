import * as Cesium from 'cesium'
import type { CameraView } from '../data/types'

/**
 * Rotate the camera around the point it's currently looking at, by `degrees`
 * (positive = clockwise). Smoothly animated. Used by the on-screen rotate
 * buttons so you can spin around whatever you're viewing.
 */
export function rotateAroundView(
  viewer: Cesium.Viewer,
  degrees: number,
  durationMs = 600,
): void {
  const scene = viewer.scene
  // Find the ground point at screen center to orbit around.
  const center = new Cesium.Cartesian2(
    scene.canvas.clientWidth / 2,
    scene.canvas.clientHeight / 2,
  )
  const picked = scene.pickPosition(center)
  const target =
    picked ??
    viewer.camera.pickEllipsoid(center, scene.globe?.ellipsoid ?? Cesium.Ellipsoid.WGS84)
  if (!target) {
    // Fallback: just spin the camera heading in place.
    viewer.camera.rotateRight(Cesium.Math.toRadians(degrees))
    return
  }

  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(target)
  const total = Cesium.Math.toRadians(degrees)
  const t0 = performance.now()
  let applied = 0
  const step = (now: number) => {
    if (viewer.isDestroyed()) return
    const p = Math.min((now - t0) / durationMs, 1)
    const targetAngle = total * p
    const delta = targetAngle - applied
    applied = targetAngle
    viewer.camera.lookAtTransform(transform)
    viewer.camera.rotateRight(delta)
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/**
 * Fly so the camera looks AT a place, keeping it centered in frame.
 * We aim at the place's ground point and orbit out by `view.height` meters
 * at the given heading/pitch — this frames the location itself rather than
 * pointing the camera past it (which a raw flyTo with a tilt does).
 */
export function flyToView(
  viewer: Cesium.Viewer,
  view: CameraView,
  durationSeconds = 3,
): Promise<boolean> {
  const target = Cesium.Cartesian3.fromDegrees(view.lng, view.lat)
  const offset = new Cesium.HeadingPitchRange(
    Cesium.Math.toRadians(view.heading),
    Cesium.Math.toRadians(view.pitch),
    view.height,
  )
  return new Promise((resolve) => {
    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(target, 1), {
      offset,
      duration: durationSeconds,
      complete: () => resolve(true),
      cancel: () => resolve(false),
    })
  })
}

/**
 * Slowly orbit the camera a full 360° around a place, then release the lock.
 * Returns a stop() function to cancel early.
 */
export function orbitAround(
  viewer: Cesium.Viewer,
  view: CameraView,
  durationMs = 9000,
): () => void {
  const target = Cesium.Cartesian3.fromDegrees(view.lng, view.lat)
  const pitch = Cesium.Math.toRadians(view.pitch)
  const range = view.height
  const startHeading = Cesium.Math.toRadians(view.heading)
  const t0 = performance.now()
  let raf = 0
  let cancelled = false

  const step = (now: number) => {
    if (cancelled || viewer.isDestroyed()) return
    const p = Math.min((now - t0) / durationMs, 1)
    const heading = startHeading + p * Cesium.Math.TWO_PI
    viewer.camera.lookAt(target, new Cesium.HeadingPitchRange(heading, pitch, range))
    if (p < 1) {
      raf = requestAnimationFrame(step)
    } else {
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    }
  }
  raf = requestAnimationFrame(step)

  return () => {
    cancelled = true
    cancelAnimationFrame(raf)
    if (!viewer.isDestroyed()) viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
  }
}

/** Zoom the camera in (factor < 1) or out (factor > 1) along its view direction. */
export function zoomBy(viewer: Cesium.Viewer, factor: number): void {
  const cam = viewer.camera
  // Distance to move scales with current height for a natural feel.
  const height = cam.positionCartographic.height
  const amount = height * (1 - factor)
  if (amount > 0) cam.moveForward(amount)
  else cam.moveBackward(-amount)
}

/** Fly to a dramatic low, street-level oblique of a place. */
export function flyToStreetLevel(
  viewer: Cesium.Viewer,
  view: CameraView,
): Promise<boolean> {
  return flyToView(
    viewer,
    { ...view, height: Math.max(140, view.height * 0.35), pitch: -8 },
    1.8,
  )
}

/** Jump instantly to look at a place (used for the initial city frame). */
export function setView(viewer: Cesium.Viewer, view: CameraView): void {
  const target = Cesium.Cartesian3.fromDegrees(view.lng, view.lat)
  viewer.camera.lookAt(
    target,
    new Cesium.HeadingPitchRange(
      Cesium.Math.toRadians(view.heading),
      Cesium.Math.toRadians(view.pitch),
      view.height,
    ),
  )
  // Release the lookAt transform so the user can freely orbit afterward.
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
}
