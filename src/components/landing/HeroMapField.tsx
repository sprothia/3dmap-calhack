import { useEffect, useRef } from 'react'
import { initHeroMapField } from './initHeroMapField'

export default function HeroMapField() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    const hero = svg?.closest('.landing-hero') as HTMLElement | null
    if (!svg || !hero) return
    // The hero animation touches SVG geometry APIs that can throw on remount
    // (e.g. returning Home from the map). Never let that crash the whole app —
    // the landing simply renders without the decorative field.
    try {
      return initHeroMapField(svg, hero)
    } catch (e) {
      console.warn('Hero map field failed to init (ignored):', e)
    }
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
