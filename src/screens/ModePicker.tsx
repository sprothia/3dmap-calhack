import { getCity } from '../data/cities'
import { useAppStore } from '../state/useAppStore'

const MODES = [
  {
    mode: 'tour' as const,
    emoji: '✈️',
    title: 'Take the flight',
    blurb:
      'Soar over the Bay on a guided aerial tour. Glide from sight to sight with a friendly word about each one.',
    accent: 'text-sky',
  },
  {
    mode: 'explore' as const,
    emoji: '🗺️',
    title: 'Explore in 3D',
    blurb:
      'Roam the map yourself. Orbit, pan, and zoom, then click any place to find out what it is and why you’d go.',
    accent: 'text-sage',
  },
]

export default function ModePicker() {
  const cityId = useAppStore((s) => s.cityId)
  const selectMode = useAppStore((s) => s.selectMode)
  const back = useAppStore((s) => s.back)
  const city = cityId ? getCity(cityId) : undefined

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">
      <button
        onClick={back}
        className="mb-8 self-start text-sm text-cocoa transition hover:text-ink"
      >
        ← Back to cities
      </button>

      <p className="mb-2 text-sm uppercase tracking-[0.3em] text-cocoa">
        {city?.name ?? 'Your city'}
      </p>
      <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">
        How do you want to explore?
      </h1>

      <div className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
        {MODES.map((m) => (
          <button
            key={m.mode}
            onClick={() => selectMode(m.mode)}
            className="group rounded-2xl border border-cocoa/20 bg-parchment p-8 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-4xl">{m.emoji}</div>
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
              {m.title}
            </h2>
            <p className="mt-2 text-sm text-cocoa">{m.blurb}</p>
            <p
              className={`mt-5 text-sm font-medium ${m.accent} opacity-0 transition group-hover:opacity-100`}
            >
              Start →
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
