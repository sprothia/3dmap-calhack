import { useCallback, useEffect, useRef } from 'react'
import type { Category, City, Place, SubPOI } from '../data/types'
import type { useViewer } from '../cesium/useViewer'
import { addPins, type PinHandle } from '../cesium/pins'
import { flyToView, orbitAround, flyToStreetLevel } from '../cesium/camera'
import { useAppStore } from '../state/useAppStore'
import { useScene } from '../state/useScene'
import PlacePanel from '../components/PlacePanel'
import CategorySidebar from '../components/CategorySidebar'

interface ExploreModeProps {
  city: City
  viewer: ReturnType<typeof useViewer>
}

export default function ExploreMode({ city, viewer }: ExploreModeProps) {
  const pinsRef = useRef<PinHandle | null>(null)
  const orbitStopRef = useRef<(() => void) | null>(null)
  const selectedPlaceId = useAppStore((s) => s.selectedPlaceId)
  const selectPlace = useAppStore((s) => s.selectPlace)
  const active = useScene((s) => s.activeCategories) as Category[] | null
  const setActive = useScene((s) => s.setActiveCategories)

  const selectedPlace = city.places.find((p) => p.id === selectedPlaceId) ?? null

  const stopOrbit = useCallback(() => {
    orbitStopRef.current?.()
    orbitStopRef.current = null
  }, [])

  const flyToPlace = useCallback(
    (place: Place) => {
      const v = viewer.viewerRef.current
      if (!v) return
      stopOrbit()
      selectPlace(place.id)
      flyToView(v, place.view, 2)
    },
    [viewer.viewerRef, selectPlace, stopOrbit],
  )

  // Pins, set up once; click flies + selects.
  useEffect(() => {
    const v = viewer.viewerRef.current
    if (!viewer.ready || !v) return

    const handle = addPins(v, city.places, (placeId) => {
      const place = city.places.find((p) => p.id === placeId)
      if (place) flyToPlace(place)
    })
    pinsRef.current = handle
    return () => {
      stopOrbit()
      handle.destroy()
      pinsRef.current = null
    }
  }, [viewer.ready, viewer.viewerRef, city.places, flyToPlace, stopOrbit])

  // Start unfiltered each time Explore opens.
  useEffect(() => {
    setActive(null)
    return () => setActive(null)
  }, [setActive])

  // Keep pins in sync with selection + filter.
  useEffect(() => {
    pinsRef.current?.setSelected(selectedPlaceId)
  }, [selectedPlaceId])
  useEffect(() => {
    pinsRef.current?.setFilter(active)
  }, [active])

  const toggleCategory = useCallback(
    (cat: Category) => {
      const current = active ?? []
      // From "all", toggling a category means: show just that one.
      if (active === null) {
        setActive([cat])
        return
      }
      const next = current.includes(cat)
        ? current.filter((c) => c !== cat)
        : [...current, cat]
      setActive(next.length === 0 ? null : next)
    },
    [active, setActive],
  )

  const lookAround = useCallback(() => {
    const v = viewer.viewerRef.current
    if (!v || !selectedPlace) return
    stopOrbit()
    orbitStopRef.current = orbitAround(v, selectedPlace.view)
  }, [viewer.viewerRef, selectedPlace, stopOrbit])

  const streetView = useCallback(() => {
    const v = viewer.viewerRef.current
    if (!v || !selectedPlace) return
    stopOrbit()
    flyToStreetLevel(v, selectedPlace.view)
  }, [viewer.viewerRef, selectedPlace, stopOrbit])

  const flyToSubPOI = useCallback(
    (sub: SubPOI) => {
      const v = viewer.viewerRef.current
      if (!v) return
      stopOrbit()
      flyToView(v, sub.view, 2)
    },
    [viewer.viewerRef, stopOrbit],
  )

  return (
    <>
      {viewer.ready && (
        <CategorySidebar
          city={city}
          active={active}
          onToggle={toggleCategory}
          onShowAll={() => setActive(null)}
          onPickPlace={flyToPlace}
          selectedPlaceId={selectedPlaceId}
        />
      )}
      {selectedPlace && (
        <PlacePanel
          place={selectedPlace}
          onClose={() => {
            stopOrbit()
            selectPlace(null)
          }}
          onLookAround={lookAround}
          onStreetView={streetView}
          onFlyToSubPOI={flyToSubPOI}
        />
      )}
    </>
  )
}
