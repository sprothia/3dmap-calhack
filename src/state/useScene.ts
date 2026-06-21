import { create } from 'zustand'

interface SceneState {
  /** Categories currently shown on the map (null = all). */
  activeCategories: string[] | null
  setActiveCategories: (c: string[] | null) => void
}

export const useScene = create<SceneState>((set) => ({
  activeCategories: null,
  setActiveCategories: (activeCategories) => set({ activeCategories }),
}))
