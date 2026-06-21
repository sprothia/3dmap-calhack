import type { District } from '../data/types'

interface DistrictCardProps {
  district: District
  onClose: () => void
}

export default function DistrictCard({ district, onClose }: DistrictCardProps) {
  return (
    <div
      className="pointer-events-auto absolute bottom-4 right-4 z-20 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-cream shadow-xl ring-1 ring-black/5"
      style={{ animation: 'fadeInPlace 0.3s ease both' }}
    >
      <div className="relative p-5">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 text-cocoa transition hover:text-ink"
        >
          ✕
        </button>

        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cocoa">
          Neighborhood
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold text-ink">
          {district.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-cocoa">{district.blurb}</p>

        {district.facts && district.facts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {district.facts.map((f) => (
              <span
                key={f}
                className="rounded-full bg-parchment px-2.5 py-1 text-[11px] font-medium text-cocoa"
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
