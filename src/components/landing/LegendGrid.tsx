const LEGEND_ITEMS = [
  {
    key: 'Route',
    title: 'Fly the line',
    desc: 'Soar the skyline on a guided aerial route, narrated stop to stop.',
    delay: 'd3',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 21 C8 15 12 17 15 11 S22 5 23 4" strokeDasharray="1.5 3" />
        <path d="M19 3.5 L23.5 4 L21 7.8 L20 5.2 Z" fill="#2A4ACB" stroke="none" />
        <circle cx="3" cy="21" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'Surface',
    title: 'See it in 3-D',
    desc: 'Orbit, pan and zoom a photoreal model. Tap anywhere to drop in.',
    delay: 'd4',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M13 3 L22 8 L13 13 L4 8 Z" />
        <path d="M4 8 V17 L13 22 V13" />
        <path d="M22 8 V17 L13 22" />
      </svg>
    ),
  },
  {
    key: 'Place',
    title: 'Know the place',
    desc: 'Real history, stats and local tips — like a friend showing you around.',
    delay: 'd5',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M13 23 C13 23 5 16 5 10 A8 8 0 0 1 21 10 C21 16 13 23 13 23 Z" />
        <circle cx="13" cy="10" r="2.6" fill="#E2A33C" stroke="none" />
      </svg>
    ),
  },
] as const

export default function LegendGrid() {
  return (
    <section className="landing-legend">
      <div className="landing-legend-grid">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.key} className={`landing-lg-item landing-rise ${item.delay}`}>
            <div className="landing-lg-sym" aria-hidden="true">
              {item.icon}
            </div>
            <div className="landing-lg-key">{item.key}</div>
            <h3 className="landing-lg-title">{item.title}</h3>
            <p className="landing-lg-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
