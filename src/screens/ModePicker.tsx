import { getCity } from '../data/cities'
import { useAppStore } from '../state/useAppStore'

const MODES = [
  {
    mode: 'tour' as const,
    emoji: '✈️',
    title: 'Take the flight',
    tagline: 'Sit back & soar',
    blurb:
      'A guided aerial tour over the Bay’s greatest hits, with a friendly word at every sight.',
    features: ['Cinematic camera', 'Narrated stops', 'Hands-free auto-play'],
    gradient: 'from-[#3B82C4] via-[#5B8DB8] to-[#7fb2e6]',
    glow: 'group-hover:shadow-[0_20px_60px_-15px_rgba(59,130,196,0.5)]',
    cta: 'Start the flight',
    // Aerial Golden Gate Bridge footage (Pexels, royalty-free).
    video: 'https://videos.pexels.com/video-files/1994828/1994828-sd_960_540_24fps.mp4',
  },
  {
    mode: 'explore' as const,
    emoji: '🗺️',
    title: 'Explore in 3D',
    tagline: 'Roam freely',
    blurb:
      'Take the controls. Orbit, pan, and zoom the city, then click any place to dive into it.',
    features: ['Filter by category', 'Search any place', 'Deep info on each spot'],
    gradient: 'from-[#3FA66A] via-[#5aa978] to-[#7A9471]',
    glow: 'group-hover:shadow-[0_20px_60px_-15px_rgba(63,166,106,0.5)]',
    cta: 'Start exploring',
    // San Francisco cityscape footage (Pexels, royalty-free).
    video: 'https://videos.pexels.com/video-files/2098988/2098988-sd_960_540_30fps.mp4',
  },
]

export default function ModePicker() {
  const cityId = useAppStore((s) => s.cityId)
  const selectMode = useAppStore((s) => s.selectMode)
  const back = useAppStore((s) => s.back)
  const city = cityId ? getCity(cityId) : undefined

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-sky/10 blur-3xl"
        style={{ animation: 'floatSlow 10s ease-in-out infinite' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sage/10 blur-3xl"
        style={{ animation: 'floatSlow 12s ease-in-out infinite 1s' }}
      />

      <button
        onClick={back}
        className="rise-in absolute left-6 top-6 flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 text-sm font-medium text-cocoa shadow-sm transition hover:-translate-x-0.5 hover:text-ink"
      >
        ← Cities
      </button>

      <div className="relative z-10 flex w-full flex-col items-center">
        <p
          className="rise-in mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-sunset"
          style={{ animationDelay: '0ms' }}
        >
          {city?.name ?? 'Your city'}
        </p>
        <h1
          className="rise-in font-display text-4xl font-bold text-ink sm:text-5xl"
          style={{ animationDelay: '80ms' }}
        >
          How do you want to explore?
        </h1>

        <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {MODES.map((m, i) => (
            <button
              key={m.mode}
              onClick={() => selectMode(m.mode)}
              style={{ animationDelay: `${200 + i * 120}ms` }}
              className={`rise-in group relative overflow-hidden rounded-[1.75rem] bg-cream text-left shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 ${m.glow}`}
            >
              {/* Gradient hero with floating icon */}
              <div
                className={`relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br ${m.gradient}`}
              >
                {/* Live SF video preview (gradient shows as fallback behind it) */}
                <video
                  src={m.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLVideoElement).style.display = 'none'
                  }}
                />
                {/* Subtle dark gradient for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Floating emoji badge */}
                <span
                  className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/85 text-3xl shadow-lg backdrop-blur transition-transform duration-500 group-hover:scale-110"
                  style={{ animation: 'floatSlow 4s ease-in-out infinite' }}
                >
                  {m.emoji}
                </span>
                <span className="absolute bottom-3 left-4 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
                  {m.tagline}
                </span>
              </div>

              <div className="p-6">
                <h2 className="font-display text-2xl font-bold text-ink">
                  {m.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-cocoa">
                  {m.blurb}
                </p>

                <ul className="mt-4 space-y-1.5">
                  {m.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-[13px] text-cocoa"
                    >
                      <span className="text-sage">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-all duration-300 group-hover:gap-3 group-hover:bg-sunset">
                  {m.cta}
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
