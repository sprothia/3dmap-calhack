import { type ReactNode } from 'react'

interface ScreenTransitionProps {
  /** Changes whenever the screen changes — re-mounts + animates the screen in. */
  screenKey: string
  children: ReactNode
}

/** Fades + scales the active picker screen in whenever screenKey changes. */
export default function ScreenTransition({
  screenKey,
  children,
}: ScreenTransitionProps) {
  return (
    <div
      key={screenKey}
      className="h-full w-full"
      style={{ animation: 'screenIn 0.55s cubic-bezier(0.22,1,0.36,1) both' }}
    >
      {children}
    </div>
  )
}
