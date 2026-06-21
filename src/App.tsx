import { useAppStore } from './state/useAppStore'
import { getCity } from './data/cities'
import CityPicker from './screens/CityPicker'
import ModePicker from './screens/ModePicker'
import MapView from './screens/MapView'
import ExploreMode from './screens/ExploreMode'
import TourMode from './screens/TourMode'
import ScreenTransition from './components/ScreenTransition'
import TransitionCurtain from './components/TransitionCurtain'

function App() {
  const screen = useAppStore((s) => s.screen)
  const cityId = useAppStore((s) => s.cityId)
  const city = cityId ? getCity(cityId) : undefined

  const onMap = (screen === 'explore' || screen === 'tour') && city

  return (
    // Map needs a definite full-viewport height for the Cesium canvas;
    // the picker screens scroll within min-height.
    <div className={onMap ? 'h-screen w-screen overflow-hidden' : 'min-h-screen'}>
      {/* Picker screens transition with a curtain sweep. The map is kept out of
          the keyed wrapper so the Cesium viewer is never remounted. */}
      {!onMap && (
        <ScreenTransition screenKey={screen}>
          {screen === 'pick-city' && <CityPicker />}
          {screen === 'pick-mode' && <ModePicker />}
        </ScreenTransition>
      )}

      {/* Both modes share the same map; overlays differ per mode. */}
      {onMap && (
        <div style={{ animation: 'screenIn 0.6s ease both' }} className="h-full w-full">
          <MapView city={city}>
            {(viewer) =>
              screen === 'explore' ? (
                <ExploreMode city={city} viewer={viewer} />
              ) : (
                <TourMode city={city} viewer={viewer} />
              )
            }
          </MapView>
        </div>
      )}

      {/* Global transition curtain — covers every screen change */}
      <TransitionCurtain />
    </div>
  )
}

export default App
