import { useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { askAboutNeighborhood, type AskNeighborhoodResult } from '../lib/api'
import { renderMarkdown } from '../lib/renderMarkdown'

type Status = 'closed' | 'open-idle' | 'loading' | 'success' | 'error'

interface NeighborhoodAskProps {
  neighborhoodName: string
}

const DEFAULT_SIZE = { width: 256, height: 420 }
const MIN_WIDTH = 220
const MAX_WIDTH = 520
const MIN_HEIGHT = 200
const MAX_HEIGHT_VH = 0.8 // never let the panel cover the whole page

// Mount with `key={neighborhoodName}` at the call site — remounting on a new
// neighborhood resets all state here, so a stale answer never lingers.
export default function NeighborhoodAsk({ neighborhoodName }: NeighborhoodAskProps) {
  const [status, setStatus] = useState<Status>('closed')
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<AskNeighborhoodResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [size, setSize] = useState(DEFAULT_SIZE)
  const dragRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null)

  // Panel is anchored bottom-right, so the handle lives at the top-left —
  // dragging up/left grows it, away from the corner it's pinned to.
  const startResize = (e: ReactPointerEvent) => {
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startY: e.clientY, startWidth: size.width, startHeight: size.height }
    window.addEventListener('pointermove', onResizeMove)
    window.addEventListener('pointerup', stopResize)
  }

  const onResizeMove = (e: PointerEvent) => {
    const drag = dragRef.current
    if (!drag) return
    const maxHeight = window.innerHeight * MAX_HEIGHT_VH
    const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, drag.startWidth + (drag.startX - e.clientX)))
    const height = Math.min(maxHeight, Math.max(MIN_HEIGHT, drag.startHeight + (drag.startY - e.clientY)))
    setSize({ width, height })
  }

  const stopResize = () => {
    dragRef.current = null
    window.removeEventListener('pointermove', onResizeMove)
    window.removeEventListener('pointerup', stopResize)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!question.trim() || status === 'loading') return
    setStatus('loading')
    try {
      const res = await askAboutNeighborhood(neighborhoodName, question.trim())
      setResult(res)
      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  if (status === 'closed') {
    return (
      <button
        onClick={() => setStatus('open-idle')}
        title={`Ask about ${neighborhoodName}`}
        aria-label={`Ask about ${neighborhoodName}`}
        className="pointer-events-auto absolute bottom-6 right-24 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-cream/95 text-2xl shadow-xl ring-1 ring-ink/10 backdrop-blur transition hover:scale-105 hover:bg-cream active:scale-95"
        style={{ animation: 'glowPulse 3s ease-in-out infinite' }}
      >
        💬
      </button>
    )
  }

  return (
    <div
      style={{ width: size.width, height: size.height }}
      className="pointer-events-auto absolute bottom-6 right-24 z-20 flex max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-cream/95 shadow-2xl ring-1 ring-ink/10 backdrop-blur animate-[slideInRight_0.35s_ease]"
    >
      <div
        onPointerDown={startResize}
        title="Drag to resize"
        className="absolute left-0 top-0 z-10 h-5 w-5 cursor-nwse-resize touch-none"
      >
        <div className="absolute left-1 top-1 h-3 w-3 rounded-sm border-l-2 border-t-2 border-cream/50 transition hover:border-cream/90" />
      </div>

      <div className="flex shrink-0 items-start justify-between gap-2 bg-gradient-to-br from-ink to-cocoa px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-cream/60">Ask about</p>
          <p className="mt-0.5 font-display text-lg font-bold leading-tight text-cream">{neighborhoodName}</p>
        </div>
        <button
          onClick={() => setStatus('closed')}
          aria-label="Close"
          className="rounded-full p-1 text-cream/70 transition hover:bg-cream/10 hover:text-cream"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3.5 text-[13px]">
        {status !== 'loading' && (
          <form onSubmit={submit} className="flex flex-col gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`What do you want to know about ${neighborhoodName}?`}
              className="rounded-xl border border-cocoa/20 bg-white/60 px-3 py-2 text-[13px] text-ink placeholder:text-cocoa/50 focus:outline-none focus:ring-2 focus:ring-sunset/40"
            />
            <button
              type="submit"
              disabled={!question.trim()}
              className="rounded-xl bg-sunset px-4 py-2 text-sm font-semibold text-cream shadow transition enabled:hover:bg-[#d9632d] disabled:opacity-40"
            >
              Ask
            </button>
          </form>
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cocoa/25 border-t-cocoa" />
            <p className="text-[12px] text-cocoa">Scraping Reddit, Yelp & Google…</p>
          </div>
        )}

        {status === 'error' && (
          <p className="mt-2 text-[12px] text-sunset">⚠ {errorMessage ?? 'Could not fetch live info — try again.'}</p>
        )}

        {status === 'success' && result && (
          <div className="mt-3 space-y-2.5" style={{ animation: 'fadeInPlace 0.3s ease both' }}>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                result.fromCache ? 'bg-cocoa/10 text-cocoa' : 'bg-sage/20 text-sage'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${result.fromCache ? 'bg-cocoa/50' : 'bg-sage'}`} />
              {result.fromCache ? 'Cached' : 'Live'}
            </span>

            <div className="space-y-2 leading-relaxed text-ink">{renderMarkdown(result.answer)}</div>

            {result.sources.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa">Sources</p>
                <div className="flex flex-wrap gap-1">
                  {result.sources.map((source) => (
                    <span
                      key={source}
                      className="rounded-full border border-cocoa/15 bg-parchment px-2 py-0.5 text-[10px] font-medium text-cocoa"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
