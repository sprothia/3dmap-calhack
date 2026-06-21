// Lightweight CSS atmosphere over the explore map: drifting clouds, a few
// birds gliding across, and a soft vignette. Purely decorative, pointer-none.

const CLOUDS = [
  { top: '8%', size: 150, dur: 70, delay: 0, opacity: 0.5 },
  { top: '18%', size: 90, dur: 95, delay: 12, opacity: 0.35 },
  { top: '30%', size: 120, dur: 80, delay: 30, opacity: 0.4 },
  { top: '5%', size: 70, dur: 110, delay: 50, opacity: 0.3 },
]

const BIRDS = [
  { top: '22%', dur: 26, delay: 4, scale: 1 },
  { top: '34%', dur: 32, delay: 16, scale: 0.8 },
  { top: '15%', dur: 38, delay: 28, scale: 0.9 },
]

export default function MapAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {/* Soft top haze + vignette */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/25 to-transparent" />
      <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(40,30,20,0.25)]" />

      {/* Clouds */}
      {CLOUDS.map((c, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute rounded-full bg-white blur-2xl"
          style={{
            top: c.top,
            left: '-20%',
            width: c.size,
            height: c.size * 0.4,
            opacity: c.opacity,
            animation: `mapCloud ${c.dur}s linear ${c.delay}s infinite`,
          }}
        />
      ))}

      {/* Birds — small flapping chevrons gliding across */}
      {BIRDS.map((b, i) => (
        <div
          key={`bird-${i}`}
          className="absolute"
          style={{
            top: b.top,
            left: '-5%',
            animation: `mapBird ${b.dur}s linear ${b.delay}s infinite`,
          }}
        >
          <span
            className="bird-flap inline-block text-cocoa/70"
            style={{ fontSize: `${14 * b.scale}px` }}
          >
            ︿
          </span>
        </div>
      ))}
    </div>
  )
}
