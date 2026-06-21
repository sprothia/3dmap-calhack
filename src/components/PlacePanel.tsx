import { useState, type ReactNode } from 'react'
import type { Place, SubPOI } from '../data/types'
import { CATEGORY_CHIP, CATEGORY_EMOJI, CATEGORY_LABEL } from '../data/categories'
import ImageGallery from './ImageGallery'

interface PlacePanelProps {
  place: Place
  onClose: () => void
  onLookAround: () => void
  onStreetView: () => void
  onFlyToSubPOI?: (sub: SubPOI) => void
}

type Tab = 'overview' | 'details' | 'local'

export default function PlacePanel({
  place,
  onClose,
  onLookAround,
  onStreetView,
  onFlyToSubPOI,
}: PlacePanelProps) {
  const [tab, setTab] = useState<Tab>('overview')

  const allImages = [
    ...(place.image ? [place.image] : []),
    ...(place.images ?? []),
  ]

  const hasDetails = !!(place.history || (place.stats && place.stats.length > 0))
  const hasLocal = !!(
    place.localContext ||
    (place.nearby && place.nearby.length > 0)
  )

  return (
    <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex max-h-[calc(100vh-2rem)] w-[26rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-cocoa/20 bg-cream/96 shadow-xl backdrop-blur">
      {/* Image gallery */}
      {allImages.length > 0 && (
        <ImageGallery
          images={allImages}
          alt={place.name}
          className="h-44 w-full shrink-0"
        />
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-cream/90 text-cocoa shadow transition hover:text-ink z-10"
      >
        ✕
      </button>

      {/* Header */}
      <div className="shrink-0 px-4 pt-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_CHIP[place.category]}`}
          >
            {CATEGORY_EMOJI[place.category]} {CATEGORY_LABEL[place.category]}
          </span>
        </div>
        <h2 className="mt-1.5 font-display text-xl font-semibold text-ink leading-tight">
          {place.name}
        </h2>

        {/* Tags */}
        {place.tags && place.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {place.tags.map((t) => (
              <span
                key={t.label}
                className="rounded-full bg-parchment border border-cocoa/10 px-2.5 py-0.5 text-[11px] font-medium text-cocoa"
              >
                {t.emoji} {t.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-2 flex shrink-0 gap-0.5 border-b border-cocoa/10 px-4">
        <TabBtn active={tab === 'overview'} onClick={() => setTab('overview')}>
          Overview
        </TabBtn>
        {hasDetails && (
          <TabBtn active={tab === 'details'} onClick={() => setTab('details')}>
            Details
          </TabBtn>
        )}
        {hasLocal && (
          <TabBtn active={tab === 'local'} onClick={() => setTab('local')}>
            Local Context
          </TabBtn>
        )}
      </div>

      {/* Tab content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 text-[13px] leading-snug text-cocoa">
        {tab === 'overview' && (
          <div className="space-y-3">
            <p>{place.blurb}</p>

            {/* Why visit */}
            {place.whyVisit && place.whyVisit.length > 0 && (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-cocoa/60">
                  Why go
                </p>
                <ul className="space-y-1">
                  {place.whyVisit.map((w) => (
                    <li key={w} className="flex gap-2">
                      <span className="text-[#3FA66A] shrink-0">✓</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick facts */}
            {place.facts && place.facts.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {place.facts.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-parchment px-2.5 py-1 text-[11px] text-cocoa border border-cocoa/10"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            {/* Visit logistics */}
            {(place.bestTime || place.gettingThere || place.localTip) && (
              <div className="space-y-2">
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

            {/* Look Closer sub-POIs */}
            {place.subPOIs && place.subPOIs.length > 0 && (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-cocoa/60">
                  Look closer
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {place.subPOIs.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onFlyToSubPOI?.(sub)}
                      className="rounded-xl border border-cocoa/10 bg-parchment/60 px-3 py-2 text-left transition hover:bg-parchment hover:border-cocoa/25 active:scale-95"
                    >
                      <p className="text-[12px] font-semibold text-ink">{sub.name}</p>
                      <p className="mt-0.5 text-[11px] text-cocoa/70 leading-tight">{sub.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'details' && (
          <div className="space-y-3">
            {place.history && (
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-cocoa/60">
                  History & background
                </p>
                <p>{place.history}</p>
              </div>
            )}
            {place.stats && place.stats.length > 0 && (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-cocoa/60">
                  Key facts
                </p>
                <dl className="overflow-hidden rounded-xl border border-cocoa/10">
                  {place.stats.map((s, i) => (
                    <div
                      key={s.label}
                      className={`flex justify-between px-3 py-2 ${
                        i % 2 ? 'bg-parchment/40' : 'bg-parchment/20'
                      }`}
                    >
                      <dt className="text-cocoa/70">{s.label}</dt>
                      <dd className="font-semibold text-ink">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        )}

        {tab === 'local' && (
          <div className="space-y-3">
            {place.localContext && (
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-cocoa/60">
                  Neighborhood feel
                </p>
                <p>{place.localContext.text}</p>
                {place.localContext.stats && place.localContext.stats.length > 0 && (
                  <dl className="mt-2 overflow-hidden rounded-xl border border-cocoa/10">
                    {place.localContext.stats.map((s, i) => (
                      <div
                        key={s.label}
                        className={`flex justify-between px-3 py-2 ${
                          i % 2 ? 'bg-parchment/40' : 'bg-parchment/20'
                        }`}
                      >
                        <dt className="text-cocoa/70">{s.label}</dt>
                        <dd className="font-semibold text-ink">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            )}

            {place.nearby && place.nearby.length > 0 && (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-cocoa/60">
                  Nearby
                </p>
                <div className="space-y-2">
                  {place.nearby.map((n) => (
                    <div
                      key={n.name}
                      className="rounded-xl border border-cocoa/10 bg-parchment/40 px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-semibold text-ink">{n.name}</p>
                        <span className="text-[11px] text-cocoa/60">{n.distance}</span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-cocoa/80">{n.whyVisit}</p>
                    </div>
                  ))}
                </div>
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
