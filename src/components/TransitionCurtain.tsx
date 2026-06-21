import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../state/useAppStore'

/**
 * A global curtain that sweeps across whenever the screen changes — including
 * picker ↔ map. Lives at the app root so it covers every transition without
 * remounting any screen (the map's Cesium viewer is never disturbed).
 */
export default function TransitionCurtain() {
  const screen = useAppStore((s) => s.screen)
  const [active, setActive] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setActive(true)
    const t = window.setTimeout(() => setActive(false), 700)
    return () => window.clearTimeout(t)
  }, [screen])

  if (!active) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ animation: 'curtainSweep 0.7s ease both' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-parchment to-cream" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="h-10 w-10 rounded-full border-[3px] border-cocoa/20 border-t-sunset"
          style={{ animation: 'spin 0.7s linear infinite' }}
        />
      </div>
    </div>
  )
}
