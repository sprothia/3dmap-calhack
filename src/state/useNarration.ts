import { create } from 'zustand'
import { hasDeepgramKey } from '../cesium/env'
import { synthesizeSpeech } from '../narration/deepgramTTS'

interface NarrationState {
  /** A clip is currently audible. */
  isPlaying: boolean
  /** Audio for the latest `speak` is still being synthesized. */
  isLoading: boolean
  /** Global mute — silences narration everywhere. */
  muted: boolean
  /**
   * Speak `text` aloud, interrupting anything already playing. Resolves `true`
   * if it played to the end, `false` if it was interrupted, muted, errored, or
   * no Deepgram key is configured.
   */
  speak: (text: string) => Promise<boolean>
  /** Stop any current narration immediately. */
  stop: () => void
  /** Flip mute; muting also stops whatever is playing. */
  toggleMute: () => void
}

export const useNarration = create<NarrationState>((set, get) => {
  // One shared <audio> element for the whole app so clips never overlap.
  let audio: HTMLAudioElement | null = null
  let controller: AbortController | null = null
  // Bumped on every stop()/speak() so a stale in-flight request or a late
  // event from a superseded clip can't resurrect playback.
  let token = 0
  let resolveCurrent: ((finished: boolean) => void) | null = null

  const settle = (finished: boolean) => {
    if (audio) {
      audio.onended = null
      audio.onerror = null
    }
    const resolve = resolveCurrent
    resolveCurrent = null
    set({ isPlaying: false, isLoading: false })
    resolve?.(finished)
  }

  return {
    isPlaying: false,
    isLoading: false,
    muted: false,

    stop: () => {
      token++
      controller?.abort()
      controller = null
      audio?.pause()
      settle(false)
    },

    speak: async (text) => {
      get().stop()
      const trimmed = text?.trim()
      if (!trimmed || !hasDeepgramKey || get().muted) return false

      const myToken = ++token
      controller = new AbortController()
      set({ isLoading: true })

      let url: string
      try {
        url = await synthesizeSpeech(trimmed, controller.signal)
      } catch {
        if (myToken === token) settle(false)
        return false
      }
      // A newer speak()/stop() ran while we were synthesizing.
      if (myToken !== token) return false

      if (!audio) audio = new Audio()
      const el = audio
      el.src = url
      set({ isLoading: false, isPlaying: true })

      return new Promise<boolean>((resolve) => {
        resolveCurrent = resolve
        el.onended = () => myToken === token && settle(true)
        el.onerror = () => myToken === token && settle(false)
        el.play().catch(() => myToken === token && settle(false))
      })
    },

    toggleMute: () => {
      const next = !get().muted
      if (next) get().stop()
      set({ muted: next })
    },
  }
})
