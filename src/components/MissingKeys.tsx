import { useAppStore } from '../state/useAppStore'

export default function MissingKeys() {
  const back = useAppStore((s) => s.back)
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg rounded-2xl border border-cocoa/20 bg-parchment p-8 shadow-sm">
        <div className="text-4xl">🗝️</div>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">
          Add your map keys
        </h1>
        <p className="mt-3 text-cocoa">
          The 3D map needs two free API keys. Copy{' '}
          <code className="rounded bg-cream px-1.5 py-0.5 text-sm">.env.example</code>{' '}
          to <code className="rounded bg-cream px-1.5 py-0.5 text-sm">.env</code> and
          fill in:
        </p>
        <ul className="mx-auto mt-4 max-w-sm space-y-2 text-left text-sm text-cocoa">
          <li>
            <span className="font-medium text-ink">VITE_CESIUM_ION_TOKEN</span> —{' '}
            <a
              className="text-sunset underline"
              href="https://ion.cesium.com/tokens"
              target="_blank"
              rel="noreferrer"
            >
              ion.cesium.com/tokens
            </a>
          </li>
          <li>
            <span className="font-medium text-ink">VITE_GOOGLE_MAPS_KEY</span> — a
            Google Maps key with the{' '}
            <span className="font-medium">Map Tiles API</span> enabled
          </li>
        </ul>
        <p className="mt-4 text-sm text-cocoa">
          Then restart the dev server.
        </p>
        <button
          onClick={back}
          className="mt-6 rounded-full bg-cocoa px-5 py-2 text-sm font-medium text-cream transition hover:bg-ink"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}
