import * as Cesium from 'cesium'
import type { RoutePoint } from '../data/types'

/**
 * A smooth ride path along the ground, as a Catmull-Rom spline through the
 * route points. Used to drive a cinematic camera that glides above the line.
 */
export class Route {
  private spline: Cesium.CatmullRomSpline

  constructor(points: RoutePoint[]) {
    const positions = points.map((p) =>
      Cesium.Cartesian3.fromDegrees(p.lng, p.lat, 0),
    )

    // Even speed: distribute spline times by cumulative distance.
    const dist: number[] = [0]
    for (let i = 1; i < positions.length; i++) {
      dist.push(
        dist[i - 1] + Cesium.Cartesian3.distance(positions[i - 1], positions[i]),
      )
    }
    const total = dist[dist.length - 1] || 1
    const times = dist.map((d) => d / total)

    this.spline = new Cesium.CatmullRomSpline({ times, points: positions })
  }

  /** Ground position (Cartesian3, height 0) at fraction t in [0,1]. */
  positionAt(t: number): Cesium.Cartesian3 {
    return this.spline.evaluate(Cesium.Math.clamp(t, 0, 1))
  }

  /** Direction of travel (radians) at fraction t. */
  headingAt(t: number): number {
    const eps = 0.0015
    const a = this.positionAt(Cesium.Math.clamp(t - eps, 0, 1))
    const b = this.positionAt(Cesium.Math.clamp(t + eps, 0, 1))
    return headingBetween(a, b)
  }

  /** Fraction t whose ground point is nearest a lat/lng (places a stop on the line). */
  fractionNearest(lat: number, lng: number, samples = 600): number {
    const target = Cesium.Cartesian3.fromDegrees(lng, lat, 0)
    let best = 0
    let bestDist = Infinity
    for (let i = 0; i <= samples; i++) {
      const t = i / samples
      const d = Cesium.Cartesian3.distance(this.positionAt(t), target)
      if (d < bestDist) {
        bestDist = d
        best = t
      }
    }
    return best
  }
}

/** Compass heading (radians) from a to b in a's local ground frame. */
export function headingBetween(
  a: Cesium.Cartesian3,
  b: Cesium.Cartesian3,
): number {
  const enu = Cesium.Transforms.eastNorthUpToFixedFrame(a)
  const inv = Cesium.Matrix4.inverseTransformation(enu, new Cesium.Matrix4())
  const local = Cesium.Matrix4.multiplyByPoint(inv, b, new Cesium.Cartesian3())
  return Math.atan2(local.x, local.y) // x=east, y=north
}
