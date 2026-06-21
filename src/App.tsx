import { useAppStore } from './state/useAppStore'
import { getCity } from './data/cities'
import CityPicker from './screens/CityPicker'
import ModePicker from './screens/ModePicker'
import MapView from './screens/MapView'
import ExploreMode from './screens/ExploreMode'
import TourMode from './screens/TourMode'

function App() {
  const screen = useAppStore((s) => s.screen)
  const cityId = useAppStore((s) => s.cityId)
  const city = cityId ? getCity(cityId) : undefined

  const onMap = (screen === 'explore' || screen === 'tour') && city

  return (
    // Map needs a definite full-viewport height for the Cesium canvas;
    // the picker screens scroll within min-height.
    <div className={onMap ? 'h-screen w-screen overflow-hidden' : 'min-h-screen'}>
      {screen === 'pick-city' && <CityPicker />}
      {screen === 'pick-mode' && <ModePicker />}

      {/* Both modes share the same map; overlays differ per mode. */}
      {onMap && (
        <MapView city={city}>
          {(viewer) =>
            screen === 'explore' ? (
              <ExploreMode city={city} viewer={viewer} />
            ) : (
              <TourMode city={city} viewer={viewer} />
            )
          }
        </MapView>
      )}
    </div>
  )
}

export default App
