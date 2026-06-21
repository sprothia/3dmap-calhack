// A quiet signature flourish: soft fog drifting along the bottom edge,
// echoing the Bay's rolling fog. Purely decorative, non-interactive.
export default function Fog() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 overflow-hidden">
      <div className="fog-band fog-band-1" />
      <div className="fog-band fog-band-2" />
    </div>
  )
}
