import { useCallback, useEffect, useRef, useState } from 'react'
import type { Category, City, District, Place, SubPOI } from '../data/types'
import type { useViewer } from '../cesium/useViewer'
import { addPins, type PinHandle } from '../cesium/pins'
import { addDistricts, type DistrictHandle } from '../cesium/districts'
import { flyToView, orbitAround, flyToStreetLevel } from '../cesium/camera'
import { useAppStore } from '../state/useAppStore'
import { useScene } from '../state/useScene'
import { drawRouteLine, type RouteLineHandle } from '../cesium/routeLine'
import PlacePanel from '../components/PlacePanel'
import CategorySidebar from '../components/CategorySidebar'
import DistrictCard from '../components/DistrictCard'
import MapAtmosphere from '../components/MapAtmosphere'
import CommutePanel from '../components/CommutePanel'

interface ExploreModeProps {
  city: City
  viewer: ReturnType<typeof useViewer>
}

export default function ExploreMode({ city, viewer }: ExploreModeProps) {
  const pinsRef = useRef<PinHandle | null>(null)
  const districtsRef = useRef<DistrictHandle | null>(null)
  const orbitStopRef = useRef<(() => void) | null>(null)
  const [cardHidden, setCardHidden] = useState(false)
  const [showDistricts, setShowDistricts] = useState(false)
  const [activeDistrict, setActiveDistrict] = useState<District | null>(null)
  const [showCommute, setShowCommute] = useState(false)
  const routeLineRef = useRef<RouteLineHandle | null>(null)
  const selectedPlaceId = useAppStore((s) => s.selectedPlaceId)
  const selectPlace = useAppStore((s) => s.selectPlace)
  const active = useScene((s) => s.activeCategories) as Category[] | null
  const setActive = useScene((s) => s.setActiveCategories)

  const selectedPlace = city.places.find((p) => p.id === selectedPlaceId) ?? null

  const stopOrbit = useCallback(() => {
    orbitStopRef.current?.()
    orbitStopRef.current = null
  }, [])

  const showRoute = useCallback(
    (path: [number, number][]) => {
      const v = viewer.viewerRef.current
      if (!v || path.length === 0) return
      routeLineRef.current?.destroy()
      const handle = drawRouteLine(v, path)
      routeLineRef.current = handle
      // Frame just the route line.
      v.flyTo(handle.entity, { duration: 1.5 }).catch(() => {})
    },
    [viewer.viewerRef],
  )

  const clearRoute = useCallback(() => {
    routeLineRef.current?.destroy()
    routeLineRef.current = null
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
      routeLineRef.current?.destroy()
      routeLineRef.current = null
      pinsRef.current = null
    }
  }, [viewer.ready, viewer.viewerRef, city.places, flyToPlace, stopOrbit])

  // Districts: set up once, hidden until toggled on.
  useEffect(() => {
    const v = viewer.viewerRef.current
    if (!viewer.ready || !v || !city.districts) return
    const handle = addDistricts(v, city.districts, (id) => {
      const d = city.districts!.find((x) => x.id === id)
      if (!d) return
      setActiveDistrict(d)
      flyToView(v, d.view, 2)
    })
    handle.setVisible(false)
    districtsRef.current = handle
    return () => {
      handle.destroy()
      districtsRef.current = null
    }
  }, [viewer.ready, viewer.viewerRef, city.districts])

  useEffect(() => {
    districtsRef.current?.setVisible(showDistricts)
    if (!showDistricts) setActiveDistrict(null)
  }, [showDistricts])

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

  // Reset card visibility whenever a different place is selected.
  useEffect(() => {
    setCardHidden(false)
  }, [selectedPlaceId])

  const lookAround = useCallback(() => {
    const v = viewer.viewerRef.current
    if (!v || !selectedPlace) return
    stopOrbit()
    setCardHidden(true) // get the card out of the way of the view
    orbitStopRef.current = orbitAround(v, selectedPlace.view)
  }, [viewer.viewerRef, selectedPlace, stopOrbit])

  const streetView = useCallback(() => {
    const v = viewer.viewerRef.current
    if (!v || !selectedPlace) return
    stopOrbit()
    setCardHidden(true)
    flyToStreetLevel(v, selectedPlace.view)
  }, [viewer.viewerRef, selectedPlace, stopOrbit])

  const flyToSubPOI = useCallback(
    (sub: SubPOI) => {
      const v = viewer.viewerRef.current
      if (!v) return
      stopOrbit()
      setCardHidden(true)
      flyToView(v, sub.view, 2)
    },
    [viewer.viewerRef, stopOrbit],
  )

  return (
    <>
      {viewer.ready && <MapAtmosphere />}
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

      {/* Top-center toggles: districts + commute */}
      {viewer.ready && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-20 flex -translate-x-1/2 gap-2">
          {city.districts && city.districts.length > 0 && (
            <button
              onClick={() => setShowDistricts((s) => !s)}
              className={`pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg ring-1 ring-black/5 backdrop-blur transition active:scale-95 ${
                showDistricts ? 'bg-ink text-cream' : 'bg-cream/90 text-ink hover:bg-cream'
              }`}
            >
              {showDistricts ? 'Hide districts' : 'Districts'}
            </button>
          )}
          <button
            onClick={() =>
              setShowCommute((s) => {
                if (s) clearRoute()
                return !s
              })
            }
            className={`pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg ring-1 ring-black/5 backdrop-blur transition active:scale-95 ${
              showCommute ? 'bg-ink text-cream' : 'bg-cream/90 text-ink hover:bg-cream'
            }`}
          >
            Commute
          </button>
        </div>
      )}

      {viewer.ready && showCommute && (
        <CommutePanel
          places={city.places}
          onClose={() => {
            setShowCommute(false)
            clearRoute()
          }}
          onShowRoute={showRoute}
        />
      )}

      {activeDistrict && (
        <DistrictCard
          district={activeDistrict}
          onClose={() => setActiveDistrict(null)}
        />
      )}
      {selectedPlace && !cardHidden && (
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

      {/* Pop the card back up after Look around / Street view */}
      {selectedPlace && cardHidden && (
        <button
          onClick={() => setCardHidden(false)}
          className="pointer-events-auto absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink shadow-lg ring-1 ring-black/5 transition hover:-translate-y-0.5 active:scale-95"
          style={{ animation: 'fadeInPlace 0.3s ease both' }}
        >
          <span className="text-base">↑</span>
          {selectedPlace.name}
        </button>
      )}
    </>
  )
}
