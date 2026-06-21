import * as Cesium from 'cesium'
import type { Place } from '../data/types'
import { CATEGORY_COLOR } from '../data/categories'

export interface PinHandle {
  /** Highlight one pin (selected) and dim the rest; pass null to clear. */
  setSelected: (placeId: string | null) => void
  /** Show only pins in these categories (null = show all). */
  setFilter: (categories: string[] | null) => void
  /** Restrict visible pins to a set of place ids (null = no id restriction). */
  setVisibleIds: (ids: string[] | null) => void
  destroy: () => void
}

interface PinEntry {
  place: Place
  entity: Cesium.Entity
}

/**
 * Adds a clickable pin per place. Pins are colored by category with an emoji +
 * name label. Supports category filtering and selection highlighting.
 */
export function addPins(
  viewer: Cesium.Viewer,
  places: Place[],
  onPick: (placeId: string) => void,
): PinHandle {
  const entries: PinEntry[] = places.map((place) => {
    const color = Cesium.Color.fromCssColorString(CATEGORY_COLOR[place.category])
    const entity = viewer.entities.add({
      id: `pin-${place.id}`,
      position: Cesium.Cartesian3.fromDegrees(place.lng, place.lat),
      point: {
        pixelSize: 16,
        color,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 3,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        // Far-away pins (other side of the bay) shrink and fade out instead of
        // floating as big dots over un-streamed terrain.
        scaleByDistance: new Cesium.NearFarScalar(2000, 1.0, 90000, 0.45),
        translucencyByDistance: new Cesium.NearFarScalar(60000, 1.0, 120000, 0.0),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 120000),
      },
      label: {
        text: place.name,
        font: '13px Inter, sans-serif',
        fillColor: Cesium.Color.fromCssColorString('#3A2E25'),
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString('#FBF3E4').withAlpha(0.92),
        backgroundPadding: new Cesium.Cartesian2(8, 5),
        style: Cesium.LabelStyle.FILL,
        pixelOffset: new Cesium.Cartesian2(0, -24),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 45000),
      },
    })
    return { place, entity }
  })

  let filter: string[] | null = null
  let visibleIds: string[] | null = null
  let selected: string | null = null

  function refresh() {
    for (const { place, entity } of entries) {
      const catOk = !filter || filter.includes(place.category)
      const idOk = !visibleIds || visibleIds.includes(place.id)
      const visible = catOk && idOk
      entity.show = visible
      const isSel = selected === place.id
      const dim = selected !== null && !isSel
      if (entity.point) {
        entity.point.pixelSize = new Cesium.ConstantProperty(isSel ? 24 : 16)
        entity.point.outlineWidth = new Cesium.ConstantProperty(isSel ? 4 : 3)
      }
      if (entity.label) {
        entity.label.fillColor = new Cesium.ConstantProperty(
          Cesium.Color.fromCssColorString('#3A2E25').withAlpha(dim ? 0.3 : 1),
        )
        // Only label the selected one when something is selected (less clutter).
        entity.label.show = new Cesium.ConstantProperty(!dim)
      }
    }
  }

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
    const picked = viewer.scene.pick(movement.position)
    const id = picked?.id?.id as string | undefined
    if (id && id.startsWith('pin-')) {
      onPick(id.slice('pin-'.length))
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  return {
    setSelected(placeId) {
      selected = placeId
      refresh()
    },
    setFilter(categories) {
      filter = categories
      refresh()
    },
    setVisibleIds(ids) {
      visibleIds = ids
      refresh()
    },
    destroy() {
      handler.destroy()
      for (const { entity } of entries) viewer.entities.remove(entity)
    },
  }
}
