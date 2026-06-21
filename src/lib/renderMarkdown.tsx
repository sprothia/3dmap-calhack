import type { ReactNode } from 'react'

const BULLET_RE = /^[-*]\s+/
const NUMBERED_RE = /^\d+\.\s+/

function renderInline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      ),
    )
}

/** Renders Claude's lightweight markdown (bold, bullet/numbered lists, paragraphs) as JSX. */
export function renderMarkdown(text: string): ReactNode {
  const lines = text.split('\n')
  const blocks: ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line) {
      i++
      continue
    }

    if (BULLET_RE.test(line)) {
      const items: string[] = []
      while (i < lines.length && BULLET_RE.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(BULLET_RE, ''))
        i++
      }
      blocks.push(
        <ul key={blocks.length} className="list-disc space-y-1 pl-4">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>,
      )
      continue
    }

    if (NUMBERED_RE.test(line)) {
      const items: string[] = []
      while (i < lines.length && NUMBERED_RE.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(NUMBERED_RE, ''))
        i++
      }
      blocks.push(
        <ol key={blocks.length} className="list-decimal space-y-1 pl-4">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>,
      )
      continue
    }

    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() && !BULLET_RE.test(lines[i].trim()) && !NUMBERED_RE.test(lines[i].trim())) {
      paraLines.push(lines[i].trim())
      i++
    }
    blocks.push(<p key={blocks.length}>{renderInline(paraLines.join(' '))}</p>)
  }

  return <>{blocks}</>
}
