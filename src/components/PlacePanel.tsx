import { useState, type ReactNode } from 'react'
import type { Place, SubPOI } from '../data/types'
import { CATEGORY_COLOR, CATEGORY_LABEL } from '../data/categories'
import { placeGallery } from '../data/placeImages'
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
  const accent = CATEGORY_COLOR[place.category]

  // Every place shows at least two photos (real first, scenic fillers after).
  const allImages = placeGallery(place, 2)

  const hasDetails = !!(place.history || (place.stats && place.stats.length > 0))
  const hasLocal = !!(
    place.localContext ||
    (place.nearby && place.nearby.length > 0)
  )

  return (
    <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex max-h-[calc(100vh-2rem)] w-[26rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white text-[#1c1917] shadow-2xl ring-1 ring-black/10">
      {/* Image gallery */}
      {allImages.length > 0 && (
        <div className="relative shrink-0">
          <ImageGallery
            images={allImages}
            alt={place.name}
            className="h-44 w-full"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
      >
        ✕
      </button>

      {/* Header */}
      <div className="shrink-0 px-5 pt-4">
        <span
          className="inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: accent + '1A', color: accent }}
        >
          {CATEGORY_LABEL[place.category]}
        </span>
        <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-[#1c1917]">
          {place.name}
        </h2>

        {place.tags && place.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {place.tags.map((t) => (
              <span
                key={t.label}
                className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600"
              >
                {t.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-3 flex shrink-0 gap-1 border-b border-stone-200 px-5">
        <TabBtn active={tab === 'overview'} accent={accent} onClick={() => setTab('overview')}>
          Overview
        </TabBtn>
        {hasDetails && (
          <TabBtn active={tab === 'details'} accent={accent} onClick={() => setTab('details')}>
            Details
          </TabBtn>
        )}
        {hasLocal && (
          <TabBtn active={tab === 'local'} accent={accent} onClick={() => setTab('local')}>
            Local
          </TabBtn>
        )}
      </div>

      {/* Tab content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-[13.5px] leading-relaxed text-stone-600">
        {tab === 'overview' && (
          <div className="space-y-4">
            <p>{place.blurb}</p>

            {place.whyVisit && place.whyVisit.length > 0 && (
              <Section label="Why go">
                <ul className="space-y-1.5">
                  {place.whyVisit.map((w) => (
                    <li key={w} className="flex gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {place.facts && place.facts.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {place.facts.map((f) => (
                  <span
                    key={f}
                    className="rounded-md bg-stone-100 px-2.5 py-1 text-[11.5px] font-medium text-stone-600"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            {(place.bestTime || place.gettingThere) && (
              <div className="space-y-1.5">
                {place.bestTime && <InfoRow label="Best time" text={place.bestTime} />}
                {place.gettingThere && (
                  <InfoRow label="Getting there" text={place.gettingThere} />
                )}
              </div>
            )}

            {place.localTip && (
              <div
                className="rounded-lg border-l-4 px-3.5 py-2.5 text-[12.5px]"
                style={{ borderColor: accent, backgroundColor: accent + '0D' }}
              >
                <span className="font-semibold text-[#1c1917]">Local tip — </span>
                <span className="text-stone-600">{place.localTip}</span>
              </div>
            )}

            {place.subPOIs && place.subPOIs.length > 0 && (
              <Section label="Look closer">
                <div className="grid grid-cols-2 gap-2">
                  {place.subPOIs.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onFlyToSubPOI?.(sub)}
                      className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-left transition hover:border-stone-300 hover:bg-stone-50 active:scale-95"
                    >
                      <p className="text-[12.5px] font-semibold text-[#1c1917]">
                        {sub.name}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-tight text-stone-500">
                        {sub.description}
                      </p>
                    </button>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}

        {tab === 'details' && (
          <div className="space-y-4">
            {place.history && (
              <Section label="History & background">
                <p>{place.history}</p>
              </Section>
            )}
            {place.stats && place.stats.length > 0 && (
              <Section label="Key facts">
                <StatTable stats={place.stats} />
              </Section>
            )}
          </div>
        )}

        {tab === 'local' && (
          <div className="space-y-4">
            {place.localContext && (
              <Section label="Neighborhood feel">
                <p>{place.localContext.text}</p>
                {place.localContext.stats && place.localContext.stats.length > 0 && (
                  <div className="mt-2.5">
                    <StatTable stats={place.localContext.stats} />
                  </div>
                )}
              </Section>
            )}

            {place.nearby && place.nearby.length > 0 && (
              <Section label="Nearby">
                <div className="space-y-2">
                  {place.nearby.map((n) => (
                    <div
                      key={n.name}
                      className="rounded-lg border border-stone-200 px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold text-[#1c1917]">
                          {n.name}
                        </p>
                        <span className="shrink-0 text-[11px] font-medium text-stone-400">
                          {n.distance}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12px] leading-snug text-stone-500">
                        {n.whyVisit}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}
      </div>

      {/* Camera actions footer */}
      <div className="flex shrink-0 gap-2 border-t border-stone-200 px-5 py-3">
        <button
          onClick={onLookAround}
          className="flex-1 rounded-lg bg-stone-100 px-3 py-2 text-[12.5px] font-semibold text-stone-700 transition hover:bg-stone-200 active:scale-95"
        >
          Look around
        </button>
        <button
          onClick={onStreetView}
          className="flex-1 rounded-lg bg-stone-100 px-3 py-2 text-[12.5px] font-semibold text-stone-700 transition hover:bg-stone-200 active:scale-95"
        >
          Street view
        </button>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
        {label}
      </p>
      {children}
    </div>
  )
}

function StatTable({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <dl className="overflow-hidden rounded-lg border border-stone-200">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex justify-between gap-3 px-3 py-2 text-[12.5px] ${
            i % 2 ? 'bg-stone-50' : 'bg-white'
          }`}
        >
          <dt className="text-stone-500">{s.label}</dt>
          <dd className="text-right font-semibold text-[#1c1917]">{s.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function TabBtn({
  active,
  accent,
  onClick,
  children,
}: {
  active: boolean
  accent: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 px-2 py-2.5 text-[13px] font-semibold transition ${
        active ? 'text-[#1c1917]' : 'border-transparent text-stone-400 hover:text-stone-600'
      }`}
      style={active ? { borderColor: accent } : undefined}
    >
      {children}
    </button>
  )
}

function InfoRow({ label, text }: { label: string; text: string }) {
  return (
    <p>
      <span className="font-semibold text-[#1c1917]">{label}: </span>
      <span className="text-stone-600">{text}</span>
    </p>
  )
}
