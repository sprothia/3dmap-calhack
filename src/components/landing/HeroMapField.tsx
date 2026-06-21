import { useEffect, useRef } from 'react'
import { initHeroMapField } from './initHeroMapField'

export default function HeroMapField() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    const hero = svg?.closest('.landing-hero') as HTMLElement | null
    if (!svg || !hero) return
    return initHeroMapField(svg, hero)
  }, [])

  return (
    <svg
      ref={svgRef}
      id="mapfield"
      className="landing-mapfield"
      viewBox="0 0 1200 760"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    />
  )
}
