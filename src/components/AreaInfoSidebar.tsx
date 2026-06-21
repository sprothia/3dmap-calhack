import type { AreaInfo } from '../data/types'

interface AreaInfoSidebarProps {
  area: AreaInfo
}

export default function AreaInfoSidebar({ area }: AreaInfoSidebarProps) {
  return (
    <div className="pointer-events-auto absolute left-4 top-1/2 z-20 w-56 -translate-y-1/2 overflow-hidden rounded-2xl bg-cream shadow-2xl ring-1 ring-ink/10 animate-[fadeIn_0.4s_ease]">
      {/* Solid colored header so it never blends into the map */}
      <div className="bg-gradient-to-br from-ink to-cocoa px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-cream/60">
          Flying over
        </p>
        <p className="mt-0.5 font-display text-lg font-bold leading-tight text-cream">
          {area.name}
        </p>
      </div>

      <div className="space-y-3 px-4 py-3.5 text-[12px] text-ink">
        {area.population && (
          <StatRow icon="👥" label="Population" value={area.population} />
        )}
        {area.density && <StatRow icon="🏙️" label="Density" value={area.density} />}
        {area.medianIncome && (
          <StatRow icon="💰" label="Median income" value={area.medianIncome} />
        )}
        {area.climate && <StatRow icon="🌤️" label="Climate" value={area.climate} />}

        {area.industries && area.industries.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa">
              Industries
            </p>
            <div className="flex flex-wrap gap-1">
              {area.industries.map((ind) => (
                <span
                  key={ind}
                  className="rounded-full border border-cocoa/15 bg-parchment px-2 py-0.5 text-[10px] font-medium text-cocoa"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>
        )}

        {area.character && (
          <div>
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-cocoa">
              Character
            </p>
            <p className="leading-snug text-ink/80">{area.character}</p>
          </div>
        )}

        {area.famousFor && area.famousFor.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-cocoa">
              Famous for
            </p>
            <ul className="space-y-0.5">
              {area.famousFor.map((f) => (
                <li key={f} className="flex gap-1.5">
                  <span className="text-sunset">★</span>
                  <span className="text-ink/85">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function StatRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-base leading-none">{icon}</span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa">
          {label}
        </p>
        <p className="font-semibold text-ink">{value}</p>
      </div>
    </div>
  )
}
