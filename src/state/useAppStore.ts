import { create } from 'zustand'

export type Screen = 'pick-city' | 'pick-mode' | 'explore' | 'tour'
export type Mode = 'explore' | 'tour'

interface AppState {
  screen: Screen
  cityId: string | null
  mode: Mode | null
  /** Place selected in explore mode (set in Phase 3). */
  selectedPlaceId: string | null

  selectCity: (cityId: string) => void
  selectMode: (mode: Mode) => void
  selectPlace: (placeId: string | null) => void
  back: () => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'pick-city',
  cityId: null,
  mode: null,
  selectedPlaceId: null,

  selectCity: (cityId) => set({ cityId, screen: 'pick-mode' }),
  selectMode: (mode) => set({ mode, screen: mode }),
  selectPlace: (selectedPlaceId) => set({ selectedPlaceId }),

  back: () =>
    set((s) => {
      if (s.screen === 'pick-mode') return { screen: 'pick-city', cityId: null }
      if (s.screen === 'explore' || s.screen === 'tour')
        return { screen: 'pick-mode', mode: null, selectedPlaceId: null }
      return {}
    }),

  reset: () =>
    set({ screen: 'pick-city', cityId: null, mode: null, selectedPlaceId: null }),
}))
