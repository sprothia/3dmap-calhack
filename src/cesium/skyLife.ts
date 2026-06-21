import * as Cesium from 'cesium'

// Brings the map to life with things that actually live in the 3D world — so
// they scale and move with the camera instead of floating as a flat overlay:
//   • volumetric cumulus clouds drifting above the bay
//   • boats wandering across the water, leaving a soft wake
//   • a few gulls gliding in slow loops
// Everything is wrapped defensively; if anything is unsupported it's skipped
// without ever breaking the map.

export interface SkyLifeHandle {
  destroy: () => void
}

/** Render an emoji to a small canvas for use as a world-space billboard. */
function emojiCanvas(emoji: string, px = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = px
  canvas.height = px
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.font = `${Math.floor(px * 0.8)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(emoji, px / 2, px * 0.55)
  }
  return canvas
}

// Cumulus clouds scattered over the bay and city (lng, lat, altitude m).
const CLOUDS: Array<[number, number, number, number]> = [
  // lng, lat, altitude, size(m)
  [-122.478, 37.831, 1000, 900],
  [-122.41, 37.792, 760, 700],
  [-122.402, 37.823, 880, 820],
  [-122.305, 37.835, 1100, 950],
  [-122.405, 37.741, 700, 640],
  [-122.508, 37.772, 820, 760],
  [-122.47, 37.864, 1180, 1000],
  [-122.372, 37.706, 720, 720],
  [-122.26, 37.805, 900, 820],
  [-122.45, 37.79, 640, 560],
]

// Boats: each wanders back and forth between two bay points (lng, lat).
const BOATS: Array<{ a: [number, number]; b: [number, number]; period: number; icon: string; size: number }> = [
  // Ferry: Ferry Building ↔ Sausalito
  { a: [-122.393, 37.795], b: [-122.478, 37.857], period: 90, icon: '⛴️', size: 130 },
  // Sailboat off the Golden Gate
  { a: [-122.47, 37.822], b: [-122.44, 37.836], period: 60, icon: '⛵', size: 90 },
  // Boat in the central bay
  { a: [-122.37, 37.8], b: [-122.33, 37.78], period: 75, icon: '🛥️', size: 100 },
  // Sailboat near the East Bay shore
  { a: [-122.33, 37.82], b: [-122.3, 37.79], period: 80, icon: '⛵', size: 85 },
]

// Gulls gliding in slow circles above the water (lng, lat, radius°, altitude m).
const GULLS: Array<{ c: [number, number]; r: number; period: number; alt: number }> = [
  { c: [-122.43, 37.808], r: 0.01, period: 26, alt: 220 },
  { c: [-122.4, 37.83], r: 0.014, period: 34, alt: 300 },
  { c: [-122.46, 37.8], r: 0.008, period: 22, alt: 180 },
]

export function addSkyLife(viewer: Cesium.Viewer): SkyLifeHandle {
  const created: Cesium.Entity[] = []
  let clouds: Cesium.CloudCollection | null = null

  try {
    // ── Volumetric clouds ──────────────────────────────────────────────
    clouds = new Cesium.CloudCollection({ noiseDetail: 16 })
    viewer.scene.primitives.add(clouds)
    for (const [lng, lat, alt, size] of CLOUDS) {
      clouds.add({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, alt),
        scale: new Cesium.Cartesian2(size, size * 0.55),
        maximumSize: new Cesium.Cartesian3(size * 0.6, size * 0.3, size * 0.35),
        slice: 0.36,
        brightness: 1.0,
      })
    }

    const boatImg = (icon: string) => emojiCanvas(icon, 96)

    // ── Boats with a drifting wake ─────────────────────────────────────
    for (const boat of BOATS) {
      const img = boatImg(boat.icon)
      const positionAt = () => {
        // Ping-pong 0→1→0 along A↔B on a fixed wall-clock period.
        const phase = (performance.now() / 1000 / boat.period) % 1
        const t = phase < 0.5 ? phase * 2 : (1 - phase) * 2
        const lng = boat.a[0] + (boat.b[0] - boat.a[0]) * t
        const lat = boat.a[1] + (boat.b[1] - boat.a[1]) * t
        return Cesium.Cartesian3.fromDegrees(lng, lat, 2)
      }
      const entity = viewer.entities.add({
        position: new Cesium.CallbackPositionProperty(positionAt, false),
        billboard: {
          image: img,
          sizeInMeters: true,
          width: boat.size,
          height: boat.size,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          disableDepthTestDistance: 0,
        },
      })
      created.push(entity)
    }

    // ── Gulls gliding in slow loops ────────────────────────────────────
    for (const gull of GULLS) {
      const img = emojiCanvas('🕊️', 48)
      const positionAt = () => {
        const ang = ((performance.now() / 1000 / gull.period) % 1) * Math.PI * 2
        const lng = gull.c[0] + Math.cos(ang) * gull.r
        const lat = gull.c[1] + Math.sin(ang) * gull.r * 0.6
        return Cesium.Cartesian3.fromDegrees(lng, lat, gull.alt)
      }
      const entity = viewer.entities.add({
        position: new Cesium.CallbackPositionProperty(positionAt, false),
        billboard: {
          image: img,
          sizeInMeters: true,
          width: 90,
          height: 90,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1.2, 40000, 0.5),
        },
      })
      created.push(entity)
    }
  } catch (e) {
    console.warn('Sky life unavailable (ignored):', e)
  }

  return {
    destroy() {
      try {
        for (const e of created) viewer.entities.remove(e)
        if (clouds && !viewer.isDestroyed()) {
          viewer.scene.primitives.remove(clouds)
        }
      } catch {
        // Viewer may already be torn down — ignore.
      }
    },
  }
}
