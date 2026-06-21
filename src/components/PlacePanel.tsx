import { useState, type ReactNode } from 'react'
import type { Place } from '../data/types'
import { CATEGORY_CHIP, CATEGORY_LABEL } from '../data/categories'

interface PlacePanelProps {
  place: Place
  onClose: () => void
  onLookAround: () => void
  onStreetView: () => void
}

type Tab = 'overview' | 'info' | 'visit'

export default function PlacePanel({
  place,
  onClose,
  onLookAround,
  onStreetView,
}: PlacePanelProps) {
  const [tab, setTab] = useState<Tab>('overview')

  const hasInfo = !!(place.history || (place.stats && place.stats.length))
  const hasVisit = !!(
    (place.whyVisit && place.whyVisit.length) ||
    place.gettingThere ||
    place.bestTime ||
    place.localTip
  )

  return (
    <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex max-h-[calc(100vh-2rem)] w-[24rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-cocoa/20 bg-cream/96 shadow-xl backdrop-blur">
      <div className="relative shrink-0">
        {place.image && (
          <img
            src={place.image}
            alt={place.name}
            className="h-36 w-full object-cover"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
          />
        )}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-cream/90 text-cocoa shadow transition hover:text-ink"
        >
          ✕
        </button>
      </div>

      <div className="shrink-0 px-4 pt-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_CHIP[place.category]}`}
        >
          {CATEGORY_LABEL[place.category]}
        </span>
        <h2 className="mt-1.5 font-display text-xl font-semibold text-ink">
          {place.name}
        </h2>
      </div>

      {/* Tabs */}
      {(hasInfo || hasVisit) && (
        <div className="mt-2 flex shrink-0 gap-1 border-b border-cocoa/10 px-4">
          <TabBtn active={tab === 'overview'} onClick={() => setTab('overview')}>
            Overview
          </TabBtn>
          {hasInfo && (
            <TabBtn active={tab === 'info'} onClick={() => setTab('info')}>
              Info
            </TabBtn>
          )}
          {hasVisit && (
            <TabBtn active={tab === 'visit'} onClick={() => setTab('visit')}>
              Visit
            </TabBtn>
          )}
        </div>
      )}

      {/* Tab content (scrolls) */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 text-[13px] leading-snug text-cocoa">
        {tab === 'overview' && (
          <div className="space-y-2.5">
            <p>{place.blurb}</p>
            {place.facts && place.facts.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {place.facts.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-parchment px-2.5 py-1 text-[11px] text-cocoa"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'info' && (
          <div className="space-y-3">
            {place.history && <p>{place.history}</p>}
            {place.stats && place.stats.length > 0 && (
              <dl className="overflow-hidden rounded-xl border border-cocoa/10">
                {place.stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex justify-between px-3 py-1.5 ${
                      i % 2 ? 'bg-parchment/40' : 'bg-parchment/20'
                    }`}
                  >
                    <dt className="text-cocoa/80">{s.label}</dt>
                    <dd className="font-medium text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )}

        {tab === 'visit' && (
          <div className="space-y-3">
            {place.whyVisit && place.whyVisit.length > 0 && (
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-cocoa/70">
                  Things to do
                </p>
                <ul className="space-y-1">
                  {place.whyVisit.map((w) => (
                    <li key={w} className="flex gap-2">
                      <span className="text-sage">✓</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {place.bestTime && (
              <InfoRow icon="🕑" label="Best time" text={place.bestTime} />
            )}
            {place.gettingThere && (
              <InfoRow icon="🚊" label="Getting there" text={place.gettingThere} />
            )}
            {place.localTip && (
              <div className="rounded-lg bg-gold/10 px-3 py-2 text-[12px] text-[#9a6a1f]">
                💡 <span className="font-medium">Local tip:</span> {place.localTip}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Camera actions footer */}
      <div className="flex shrink-0 gap-1.5 border-t border-cocoa/10 px-4 py-2.5">
        <button
          onClick={onLookAround}
          className="flex-1 rounded-full border border-cocoa/15 bg-parchment/70 px-2.5 py-1.5 text-[12px] font-medium text-cocoa transition hover:bg-parchment active:scale-95"
        >
          🔄 Look around
        </button>
        <button
          onClick={onStreetView}
          className="flex-1 rounded-full border border-cocoa/15 bg-parchment/70 px-2.5 py-1.5 text-[12px] font-medium text-cocoa transition hover:bg-parchment active:scale-95"
        >
          🏙️ Street view
        </button>
      </div>
    </div>
  )
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 px-2.5 py-2 text-[13px] font-medium transition ${
        active
          ? 'border-sunset text-ink'
          : 'border-transparent text-cocoa/60 hover:text-cocoa'
      }`}
    >
      {children}
    </button>
  )
}

function InfoRow({
  icon,
  label,
  text,
}: {
  icon: string
  label: string
  text: string
}) {
  return (
    <div className="flex gap-2">
      <span>{icon}</span>
      <p>
        <span className="font-medium text-ink">{label}:</span> {text}
      </p>
    </div>
  )
}
