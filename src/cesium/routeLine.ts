import * as Cesium from 'cesium'

export interface RouteLineHandle {
  entity: Cesium.Entity
  destroy: () => void
}

/** Draw a route path on the map as a glowing line, clamped to the ground. */
export function drawRouteLine(
  viewer: Cesium.Viewer,
  path: [number, number][],
): RouteLineHandle {
  const positions = Cesium.Cartesian3.fromDegreesArray(path.flat())
  const entity = viewer.entities.add({
    id: 'commute-route',
    polyline: {
      positions,
      width: 8,
      clampToGround: true,
      material: new Cesium.PolylineGlowMaterialProperty({
        color: Cesium.Color.fromCssColorString('#E8743B'),
        glowPower: 0.25,
      }),
    },
  })
  return {
    entity,
    destroy: () => viewer.entities.remove(entity),
  }
}
