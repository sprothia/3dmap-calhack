import { cities } from '../data/cities'
import { useAppStore } from '../state/useAppStore'

export default function CityPicker() {
  const selectCity = useAppStore((s) => s.selectCity)

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cocoa">
        A local friend, in 3D
      </p>
      <h1 className="font-display text-5xl font-bold text-ink sm:text-6xl">
        City Explorer
      </h1>
      <p className="mt-4 max-w-md text-center text-cocoa">
        Pick a city and get the lay of the land. Ride a guided tour or roam the
        map yourself.
      </p>

      <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
        {cities.map((city) => {
          const ready = city.status === 'ready'
          return (
            <button
              key={city.id}
              disabled={!ready}
              onClick={() => ready && selectCity(city.id)}
              className={[
                'group relative overflow-hidden rounded-2xl border p-6 text-left transition',
                ready
                  ? 'border-cocoa/20 bg-parchment shadow-sm hover:-translate-y-0.5 hover:shadow-md'
                  : 'cursor-not-allowed border-cocoa/10 bg-parchment/40',
              ].join(' ')}
            >
              <div className="flex items-start justify-between">
                <h2
                  className={[
                    'font-display text-2xl font-semibold',
                    ready ? 'text-ink' : 'text-cocoa/50',
                  ].join(' ')}
                >
                  {city.name}
                </h2>
                {ready ? (
                  <span className="rounded-full bg-sage/20 px-3 py-1 text-xs font-medium text-sage">
                    Ready
                  </span>
                ) : (
                  <span className="rounded-full bg-cocoa/10 px-3 py-1 text-xs font-medium text-cocoa/50">
                    Coming soon
                  </span>
                )}
              </div>
              <p
                className={[
                  'mt-2 text-sm',
                  ready ? 'text-cocoa' : 'text-cocoa/40',
                ].join(' ')}
              >
                {city.tagline}
              </p>
              {ready && (
                <p className="mt-4 text-sm font-medium text-sunset opacity-0 transition group-hover:opacity-100">
                  Let's go →
                </p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
