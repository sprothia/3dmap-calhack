import type { AreaInfo } from '../data/types'

interface AreaInfoSidebarProps {
  area: AreaInfo
}

export default function AreaInfoSidebar({ area }: AreaInfoSidebarProps) {
  return (
    <div className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 z-20 w-52 rounded-2xl border border-cocoa/20 bg-cream/92 shadow-xl backdrop-blur overflow-hidden animate-[fadeIn_0.4s_ease]">
      <div className="bg-ink/5 px-4 py-2.5 border-b border-cocoa/10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-cocoa/60">
          Area
        </p>
        <p className="mt-0.5 font-display text-[15px] font-bold text-ink leading-tight">
          {area.name}
        </p>
      </div>

      <div className="px-4 py-3 space-y-2.5 text-[12px] text-cocoa">
        {area.population && (
          <StatRow icon="👥" label="Population" value={area.population} />
        )}
        {area.density && (
          <StatRow icon="🏙️" label="Density" value={area.density} />
        )}
        {area.medianIncome && (
          <StatRow icon="💰" label="Median income" value={area.medianIncome} />
        )}
        {area.climate && (
          <StatRow icon="🌤️" label="Climate" value={area.climate} />
        )}
        {area.industries && area.industries.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa/50">
              Industries
            </p>
            <div className="flex flex-wrap gap-1">
              {area.industries.map((ind) => (
                <span
                  key={ind}
                  className="rounded-full bg-parchment border border-cocoa/10 px-2 py-0.5 text-[10px] text-cocoa"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>
        )}
        {area.character && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa/50 mb-0.5">
              Character
            </p>
            <p className="leading-snug text-cocoa/80">{area.character}</p>
          </div>
        )}
        {area.famousFor && area.famousFor.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa/50 mb-1">
              Famous for
            </p>
            <ul className="space-y-0.5">
              {area.famousFor.map((f) => (
                <li key={f} className="flex gap-1.5">
                  <span className="text-sunset">★</span>
                  <span>{f}</span>
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
      <span className="text-base leading-none mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa/50">
          {label}
        </p>
        <p className="font-medium text-ink">{value}</p>
      </div>
    </div>
  )
}
