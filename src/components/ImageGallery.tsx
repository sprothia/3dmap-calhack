import { useState } from 'react'

interface ImageGalleryProps {
  images: string[]
  alt: string
  className?: string
}

export default function ImageGallery({ images, alt, className = '' }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0)
  const [errored, setErrored] = useState<Set<number>>(new Set())

  const visible = images.filter((_, i) => !errored.has(i))
  if (visible.length === 0) return null

  // Remap current to visible index
  const visibleIndex = Math.min(current, visible.length - 1)

  const prev = () => setCurrent((c) => (c - 1 + visible.length) % visible.length)
  const next = () => setCurrent((c) => (c + 1) % visible.length)

  const handleError = (originalIndex: number) => {
    setErrored((s) => new Set([...s, originalIndex]))
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {visible.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${alt} — photo ${i + 1}`}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            i === visibleIndex ? 'opacity-100' : 'absolute inset-0 opacity-0'
          }`}
          onError={() => handleError(images.indexOf(src))}
        />
      ))}

      {visible.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/50 text-cream text-sm backdrop-blur transition hover:bg-ink/70"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/50 text-cream text-sm backdrop-blur transition hover:bg-ink/70"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {visible.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === visibleIndex ? 'w-4 bg-cream' : 'w-1.5 bg-cream/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
