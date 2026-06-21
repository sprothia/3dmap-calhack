import * as Cesium from 'cesium'
import type { District } from '../data/types'

export interface DistrictHandle {
  setVisible: (v: boolean) => void
  destroy: () => void
}

/**
 * Renders district/neighborhood labels as large rounded chips on the map.
 * Clicking one calls onPick(districtId). Visually distinct from POI pins
 * (bigger, colored background, no point dot) so areas read as zones.
 */
export function addDistricts(
  viewer: Cesium.Viewer,
  districts: District[],
  onPick: (id: string) => void,
): DistrictHandle {
  // One cohesive look for every district: a soft cream pill with dark ink
  // letter-spaced text — reads as a clean neighborhood label, not a funky pin.
  const INK = Cesium.Color.fromCssColorString('#2F2A24')
  const CREAM = Cesium.Color.fromCssColorString('#FBF3E4')

  const entities = districts.map((d) =>
    viewer.entities.add({
      id: `district-${d.id}`,
      position: Cesium.Cartesian3.fromDegrees(d.lng, d.lat),
      label: {
        text: d.name,
        font: '600 14px Inter, sans-serif',
        fillColor: INK,
        showBackground: true,
        backgroundColor: CREAM.withAlpha(0.95),
        backgroundPadding: new Cesium.Cartesian2(14, 8),
        style: Cesium.LabelStyle.FILL,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        // Visible across a wide zoom range; gently scale with distance.
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(500, 80000),
        scaleByDistance: new Cesium.NearFarScalar(2000, 1.1, 50000, 0.75),
        translucencyByDistance: new Cesium.NearFarScalar(2000, 1.0, 70000, 0.85),
      },
    }),
  )

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction(
    (movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      const picked = viewer.scene.pick(movement.position)
      const id = picked?.id?.id as string | undefined
      if (id && id.startsWith('district-')) {
        onPick(id.slice('district-'.length))
      }
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK,
  )

  return {
    setVisible(v) {
      for (const e of entities) e.show = v
    },
    destroy() {
      handler.destroy()
      for (const e of entities) viewer.entities.remove(e)
    },
  }
}
