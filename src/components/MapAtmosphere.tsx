// A light, fixed atmospheric wash over the explore map. The lively elements
// (clouds, boats, gulls) now live in the 3D scene so they scale with the
// camera — this overlay only adds a soft warm sun glow, top haze, and a gentle
// vignette for depth. Pointer-none so it never blocks interaction.

export default function MapAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,224,150,0.45),transparent_65%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/15 to-transparent" />
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(40,30,20,0.18)]" />
    </div>
  )
}
