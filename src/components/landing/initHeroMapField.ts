const NS = 'http://www.w3.org/2000/svg'

const LIGHT_R = 240
const MAX_LIFT = 15
const SHADOW_K = 3.0
const POOL_R = 165

const T = 30
const OX = 600
const OY = 478
const ux = 0.866 * T
const uy = 0.5 * T
const vx = -0.866 * T
const vy = 0.5 * T

type Pt = [number, number]

const proj = (a: number, b: number, z = 0): Pt => [
  OX + a * ux + b * vx,
  OY + a * uy + b * vy - z * T,
]

const make = <T extends SVGElement>(tag: string, attrs: Record<string, string>) => {
  const el = document.createElementNS(NS, tag) as T
  for (const k in attrs) el.setAttribute(k, attrs[k])
  return el
}

const add = (p: Pt, s: Pt): Pt => [p[0] + s[0], p[1] + s[1]]
const lerpP = (p: Pt, q: Pt, t: number): Pt => [
  p[0] + (q[0] - p[0]) * t,
  p[1] + (q[1] - p[1]) * t,
]
const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x)

function hexLerp(h1: string, h2: string, t: number) {
  const a = parseInt(h1.slice(1), 16)
  const b = parseInt(h2.slice(1), 16)
  const ar = (a >> 16) & 255
  const ag = (a >> 8) & 255
  const ab = a & 255
  const br = (b >> 16) & 255
  const bg = (b >> 8) & 255
  const bb = b & 255
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)
}

function hull(pts: Pt[]) {
  const P = pts.slice().sort((p, q) => p[0] - q[0] || p[1] - q[1])
  const cr = (o: Pt, a: Pt, b: Pt) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo: Pt[] = []
  for (const p of P) {
    while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0)
      lo.pop()
    lo.push(p)
  }
  const up: Pt[] = []
  for (let i = P.length - 1; i >= 0; i--) {
    const p = P[i]
    while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0)
      up.pop()
    up.push(p)
  }
  lo.pop()
  up.pop()
  return lo.concat(up)
}

const ptsStr = (a: Pt[]) => a.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')

function smooth(P: Pt[], closed: boolean) {
  if (P.length < 2) return ''
  const pts = closed ? [P[P.length - 1], ...P, P[0], P[1]] : [P[0], ...P, P[P.length - 1]]
  let d = `M${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}`
  const end = closed ? P.length : P.length - 1
  for (let i = 0; i < end; i++) {
    const p0 = pts[i]
    const p1 = pts[i + 1]
    const p2 = pts[i + 2]
    const p3 = pts[i + 3]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  if (closed) d += 'Z'
  return d
}

interface Building {
  g: SVGGElement
  topPoly: SVGPolygonElement
  topBase: string
  topLit: string
  win: SVGCircleElement[]
  sh: SVGPolygonElement
  corners: Pt[]
  h: number
  anchor: Pt
  name: string
  lit: number
  dest: boolean
}

export function initHeroMapField(svg: SVGSVGElement, hero: HTMLElement): () => void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cleanups: (() => void)[] = []
  let rafId = 0
  let routeTimeout = 0

  svg.replaceChildren()

  const defs = make('defs', {})
  const grad = make('radialGradient', { id: 'poolGrad' })
  grad.appendChild(
    make('stop', { offset: '0%', 'stop-color': '#F7FAF3', 'stop-opacity': '0.62' }),
  )
  grad.appendChild(
    make('stop', { offset: '55%', 'stop-color': '#EEF2E9', 'stop-opacity': '0.16' }),
  )
  grad.appendChild(
    make('stop', { offset: '100%', 'stop-color': '#E7ECE3', 'stop-opacity': '0' }),
  )
  defs.appendChild(grad)
  svg.appendChild(defs)

  const layerGrid = make('g', {})
  const layerPool = make('g', {})
  const layerCity = make('g', {})
  const layerRoute = make('g', {})
  svg.appendChild(layerGrid)
  svg.appendChild(layerPool)
  svg.appendChild(layerCity)
  svg.appendChild(layerRoute)

  const N = 9
  for (let i = -N; i <= N; i++) {
    const p1 = proj(i, -N)
    const p2 = proj(i, N)
    const p3 = proj(-N, i)
    const p4 = proj(N, i)
    layerGrid.appendChild(
      make('line', {
        x1: String(p1[0]),
        y1: String(p1[1]),
        x2: String(p2[0]),
        y2: String(p2[1]),
        stroke: 'rgba(24,33,29,0.085)',
        'stroke-width': '1',
      }),
    )
    layerGrid.appendChild(
      make('line', {
        x1: String(p3[0]),
        y1: String(p3[1]),
        x2: String(p4[0]),
        y2: String(p4[1]),
        stroke: 'rgba(24,33,29,0.085)',
        'stroke-width': '1',
      }),
    )
  }

  const gC = make('g', { opacity: '0.5' })
  const ccx = 255
  const ccy = 210
  for (let r = 0; r < 5; r++) {
    const rad = 26 + r * 22
    const pts: Pt[] = []
    for (let k = 0; k <= 24; k++) {
      const ang = (k / 24) * Math.PI * 2
      const wob = 1 + 0.12 * Math.sin(ang * 3 + r) + 0.08 * Math.cos(ang * 5)
      pts.push([ccx + Math.cos(ang) * rad * wob * 1.35, ccy + Math.sin(ang) * rad * wob * 0.7])
    }
    gC.appendChild(
      make('path', {
        d: smooth(pts, true),
        fill: 'none',
        stroke: 'rgba(24,33,29,0.085)',
        'stroke-width': '1',
      }),
    )
  }
  layerGrid.appendChild(gC)

  const pool = make('circle', { r: String(POOL_R), fill: 'url(#poolGrad)', opacity: '0' })
  const reticle = make('circle', {
    r: String(POOL_R * 0.92),
    fill: 'none',
    stroke: '#2A4ACB',
    'stroke-width': '1',
    'stroke-dasharray': '2 8',
    opacity: '0',
  })
  layerPool.appendChild(pool)
  layerPool.appendChild(reticle)

  const PLACES = [
    'Downtown',
    'The Waterfront',
    'Old Town',
    'Market District',
    'Riverside',
    'The Heights',
    'Midtown',
    'The Harbor',
    'The Park',
  ]

  const buildings = [
    { a: -2, b: -1, w: 1, d: 1, h: 5 },
    { a: 0, b: -2, w: 1, d: 2, h: 9, dest: true },
    { a: 2, b: -1, w: 2, d: 1, h: 4 },
    { a: -3, b: 1, w: 1, d: 1, h: 3 },
    { a: -1, b: 1, w: 2, d: 1, h: 6 },
    { a: 2, b: 1, w: 1, d: 2, h: 5 },
    { a: 0, b: 2, w: 1, d: 1, h: 3 },
    { a: 3, b: 2, w: 1, d: 1, h: 7 },
    { a: -2, b: 3, w: 1, d: 1, h: 4 },
  ].sort((p, q) => p.a + p.b - (q.a + q.b))

  const poly = (pts: Pt[], fill: string) =>
    make('polygon', {
      points: ptsStr(pts),
      fill,
      stroke: 'rgba(24,33,29,0.42)',
      'stroke-width': '1',
      'stroke-linejoin': 'round',
    })

  const shadowG = make('g', {})
  layerCity.appendChild(shadowG)

  function addWindows(
    group: SVGGElement,
    bl: Pt,
    br: Pt,
    tl: Pt,
    tr: Pt,
    cols: number,
    rows: number,
  ) {
    const arr: SVGCircleElement[] = []
    for (let r = 0; r < rows; r++) {
      const v = (r + 0.55) / rows
      for (let c = 0; c < cols; c++) {
        const u = (c + 0.5) / cols
        const P = lerpP(lerpP(bl, br, u), lerpP(tl, tr, u), v)
        const dot = make('circle', {
          cx: P[0].toFixed(1),
          cy: P[1].toFixed(1),
          r: '1.15',
          fill: '#F2CE78',
          opacity: '0',
        })
        group.appendChild(dot)
        arr.push(dot)
      }
    }
    return arr
  }

  const blds: Building[] = []
  buildings.forEach((B, i) => {
    const { a, b, w, d, h, dest } = B
    const A = a
    const A2 = a + w
    const Bv = b
    const B2 = b + d
    const g00 = proj(A, Bv, 0)
    const g10 = proj(A2, Bv, 0)
    const g11 = proj(A2, B2, 0)
    const g01 = proj(A, B2, 0)
    const t00 = proj(A, Bv, h)
    const t10 = proj(A2, Bv, h)
    const t11 = proj(A2, B2, h)
    const t01 = proj(A, B2, h)

    const sh = make('polygon', { points: '', fill: '#18211D', opacity: '0' })
    shadowG.appendChild(sh)

    const g = make('g', {})
    g.style.transition = 'none'
    g.style.willChange = 'transform'
    g.appendChild(poly([t10, g10, g11, t11], '#AEB9AF'))
    g.appendChild(poly([t01, t11, g11, g01], '#C4CEC1'))
    const topBase = dest ? '#C3CCDB' : '#DDE4D9'
    const topLit = dest ? '#DEE8F4' : '#F2F5EC'
    const topPoly = poly([t00, t10, t11, t01], topBase)
    g.appendChild(topPoly)

    const cR = Math.max(1, Math.round(d * 2.2))
    const cF = Math.max(1, Math.round(w * 2.2))
    const rows = clamp(h - 1, 1, 6)
    const win = addWindows(g, g10, g11, t10, t11, cR, rows).concat(
      addWindows(g, g01, g11, t01, t11, cF, rows),
    )

    layerCity.appendChild(g)
    const anchor = proj(A + w / 2, Bv + d / 2, h)
    blds.push({
      g,
      topPoly,
      topBase,
      topLit,
      win,
      sh,
      corners: [g00, g10, g11, g01],
      h,
      anchor,
      name: PLACES[i % PLACES.length],
      lit: 0,
      dest: !!dest,
    })
  })

  const hoverPin = make('g', { opacity: '0' })
  hoverPin.appendChild(
    make('circle', { r: '9', fill: 'none', stroke: '#2A4ACB', 'stroke-width': '1.4', opacity: '0.5' }),
  )
  hoverPin.appendChild(
    make('circle', { r: '3.6', fill: '#2A4ACB', stroke: '#E7ECE3', 'stroke-width': '1.4' }),
  )
  layerCity.appendChild(hoverPin)

  const wp: Pt[] = [
    [-7, 5],
    [-4, 4],
    [-1.6, 2.2],
    [0.6, 0.2],
    [0.5, -1.6],
  ].map((p) => proj(p[0], p[1], 0.25))
  const route = make<SVGPathElement>('path', {
    d: smooth(wp, false),
    fill: 'none',
    stroke: '#2A4ACB',
    'stroke-width': '2.4',
    'stroke-linecap': 'round',
    'stroke-dasharray': '2 7',
  })
  layerRoute.appendChild(route)
  wp.forEach((p, i) => {
    if (i > 0 && i < wp.length - 1) {
      layerRoute.appendChild(
        make('circle', {
          cx: String(p[0]),
          cy: String(p[1]),
          r: '2.4',
          fill: '#E7ECE3',
          stroke: '#2A4ACB',
          'stroke-width': '1.4',
        }),
      )
    }
  })

  const destB = blds.find((b) => b.dest)
  const pinAt = destB ? destB.anchor : wp[wp.length - 1]
  const pin = make('g', {})
  pin.appendChild(
    make('path', {
      d: `M${pinAt[0]} ${pinAt[1] - 26} c-6 0 -10 4.6 -10 10 c0 6.8 10 16 10 16 s10 -9.2 10 -16 c0 -5.4 -4 -10 -10 -10 z`,
      fill: '#E2A33C',
      stroke: '#C5821F',
      'stroke-width': '1.2',
    }),
  )
  pin.appendChild(make('circle', { cx: String(pinAt[0]), cy: String(pinAt[1] - 16), r: '3.4', fill: '#E7ECE3' }))
  layerRoute.appendChild(pin)

  const plane = make('path', {
    d: 'M0 -5 L7 4 L0 1.5 L-7 4 Z',
    fill: '#2A4ACB',
    stroke: '#E7ECE3',
    'stroke-width': '1',
  })
  layerRoute.appendChild(plane)
  const len = route.getTotalLength()

  let mx: number | null = null
  let my: number | null = null
  let inside = false
  let active: Building | null = null
  let cx0 = 0
  let cy0 = 0
  let poolX = OX
  let poolY = OY
  let poolA = 0
  let sunA = Math.PI * 0.78
  const px = { g: { x: 0, y: 0 }, c: { x: 0, y: 0 }, r: { x: 0, y: 0 } }
  const tg = { g: { x: 0, y: 0 }, c: { x: 0, y: 0 }, r: { x: 0, y: 0 } }

  function toUser(clientX: number, clientY: number) {
    const m = svg.getScreenCTM()
    if (!m) return null
    return new DOMPoint(clientX, clientY).matrixTransform(m.inverse())
  }

  function castShadow(b: Building, dir: Pt, mag: number, op: number) {
    const S: Pt = [dir[0] * mag, dir[1] * mag]
    const c = b.corners
    b.sh.setAttribute(
      'points',
      ptsStr(
        hull([
          c[0],
          c[1],
          c[2],
          c[3],
          add(c[0], S),
          add(c[1], S),
          add(c[2], S),
          add(c[3], S),
        ]),
      ),
    )
    b.sh.setAttribute('opacity', op.toFixed(3))
  }

  function reduceHighlight() {
    let best: Building | null = null
    let bd = 1e9
    if (inside && mx != null && my != null) {
      for (const b of blds) {
        const dx = b.anchor[0] - mx
        const dy = b.anchor[1] - my
        const d = Math.hypot(dx, dy)
        if (d < bd) {
          bd = d
          best = b
        }
      }
    }
    const hit = best && bd < 150 ? best : null
    for (const b of blds) {
      const on = b === hit ? 1 : 0
      b.topPoly.setAttribute('fill', on ? b.topLit : b.topBase)
      b.win.forEach((w) => w.setAttribute('opacity', on ? '0.85' : '0'))
    }
    if (hit) {
      hoverPin.setAttribute('transform', `translate(${hit.anchor[0]} ${hit.anchor[1]})`)
      hoverPin.setAttribute('opacity', '1')
    } else {
      hoverPin.setAttribute('opacity', '0')
    }
  }

  function onMove(e: PointerEvent) {
    const p = toUser(e.clientX, e.clientY)
    if (!p) return
    mx = p.x
    my = p.y
    inside = true
    if (!reduce) {
      const nx = clamp((mx - OX) / OX, -1, 1)
      const ny = clamp((my - 380) / 380, -1, 1)
      tg.g.x = -nx * 6
      tg.g.y = -ny * 6
      tg.c.x = -nx * 12
      tg.c.y = -ny * 12
      tg.r.x = -nx * 18
      tg.r.y = -ny * 18
    } else {
      reduceHighlight()
    }
  }

  function onLeave() {
    inside = false
    mx = my = null
    tg.g.x = tg.g.y = tg.c.x = tg.c.y = tg.r.x = tg.r.y = 0
    if (reduce) reduceHighlight()
  }

  hero.addEventListener('pointermove', onMove)
  hero.addEventListener('pointerleave', onLeave)
  hero.addEventListener('pointercancel', onLeave)
  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') onLeave()
  }
  hero.addEventListener('pointerup', onPointerUp)
  cleanups.push(() => {
    hero.removeEventListener('pointermove', onMove)
    hero.removeEventListener('pointerleave', onLeave)
    hero.removeEventListener('pointercancel', onLeave)
    hero.removeEventListener('pointerup', onPointerUp)
  })

  const onPointerDown = (e: PointerEvent) => {
    if (e.target instanceof Element && e.target.closest('.search-wrap')) return
    const p = toUser(e.clientX, e.clientY)
    if (!p) return
    poolA = Math.min(1, poolA + 0.5)
    const ring = make('circle', {
      cx: String(p.x),
      cy: String(p.y),
      r: '5',
      fill: 'none',
      stroke: '#2A4ACB',
      'stroke-width': '2',
    })
    layerRoute.appendChild(ring)
    const t0 = performance.now()
    const animateRing = (t: number) => {
      const k = Math.min(1, (t - t0) / 620)
      ring.setAttribute('r', (5 + 48 * k).toFixed(1))
      ring.setAttribute('opacity', (0.85 * (1 - k)).toFixed(3))
      ring.setAttribute('stroke-width', (2 * (1 - k) + 0.4).toFixed(2))
      if (k < 1) requestAnimationFrame(animateRing)
      else ring.remove()
    }
    requestAnimationFrame(animateRing)
  }

  if (!reduce) {
    hero.addEventListener('pointerdown', onPointerDown)
    cleanups.push(() => hero.removeEventListener('pointerdown', onPointerDown))
  }

  if (reduce) {
    route.style.strokeDasharray = ''
    const e = route.getPointAtLength(len)
    const e2 = route.getPointAtLength(len - 1)
    const ang = (Math.atan2(e.y - e2.y, e.x - e2.x) * 180) / Math.PI
    plane.setAttribute('transform', `translate(${e.x} ${e.y}) rotate(${ang + 90})`)
    const dir: Pt = [Math.cos(sunA), Math.sin(sunA) * 0.5]
    const L = Math.hypot(dir[0], dir[1])
    const u: Pt = [dir[0] / L, dir[1] / L]
    blds.forEach((b) => castShadow(b, u, (7 + b.h * SHADOW_K) * 0.7, 0.09))
    reduceHighlight()
  } else {
    route.style.strokeDasharray = `${len} ${len}`
    route.style.strokeDashoffset = String(len)
    route.style.transition = 'stroke-dashoffset 1.8s ease .35s'
    requestAnimationFrame(() => {
      route.style.strokeDashoffset = '0'
    })
    routeTimeout = window.setTimeout(() => {
      route.style.strokeDasharray = '2 7'
      route.style.strokeDashoffset = '0'
    }, 2300)

    const DUR = 9000
    let start: number | null = null
    const lp = (a: number, b: number, f: number) => a + (b - a) * f
    const ease = (t: number) => 0.5 - 0.5 * Math.cos(t * Math.PI)

    const frame = (ts: number) => {
      if (start === null) start = ts
      sunA += 0.0016

      px.g.x = lp(px.g.x, tg.g.x, 0.08)
      px.g.y = lp(px.g.y, tg.g.y, 0.08)
      px.c.x = lp(px.c.x, tg.c.x, 0.08)
      px.c.y = lp(px.c.y, tg.c.y, 0.08)
      px.r.x = lp(px.r.x, tg.r.x, 0.08)
      px.r.y = lp(px.r.y, tg.r.y, 0.08)
      cx0 = px.c.x
      cy0 = px.c.y
      layerGrid.style.transform = `translate(${px.g.x.toFixed(2)}px,${px.g.y.toFixed(2)}px)`
      layerCity.style.transform = `translate(${px.c.x.toFixed(2)}px,${px.c.y.toFixed(2)}px)`
      layerRoute.style.transform = `translate(${px.r.x.toFixed(2)}px,${px.r.y.toFixed(2)}px)`

      const sdir: Pt = [Math.cos(sunA), Math.sin(sunA) * 0.5]
      const sl = Math.hypot(sdir[0], sdir[1])
      const sunU: Pt = [sdir[0] / sl, sdir[1] / sl]

      let top: Building | null = null
      let topLit = 0
      for (const b of blds) {
        const ax = b.anchor[0] + cx0
        const ay = b.anchor[1] + cy0
        let target = 0
        let dir: Pt = sunU
        let mag = (7 + b.h * SHADOW_K) * 0.62
        if (inside && mx != null && my != null) {
          const dx = ax - mx
          const dy = ay - my
          const dist = Math.hypot(dx, dy)
          const f = clamp(1 - dist / LIGHT_R, 0, 1)
          target = f * f * (3 - 2 * f)
          if (dist > 1) {
            const distN = clamp(dist / 560, 0, 1)
            dir = [dx / dist, dy / dist]
            mag = (7 + b.h * SHADOW_K) * (0.5 + 0.75 * distN)
          }
        }
        b.lit += (target - b.lit) * 0.14

        b.g.style.transform =
          b.lit > 0.002 ? `translateY(${(-b.lit * MAX_LIFT).toFixed(2)}px)` : ''
        b.topPoly.setAttribute('fill', hexLerp(b.topBase, b.topLit, b.lit))
        if (b.lit > 0.01 || b.win[0].getAttribute('opacity') !== '0') {
          const o = (b.lit * 0.85).toFixed(3)
          b.win.forEach((w) => w.setAttribute('opacity', o))
        }
        castShadow(b, dir, mag, 0.07 + 0.07 * b.lit)

        if (b.lit > topLit) {
          topLit = b.lit
          top = b
        }
      }

      if (top && topLit > 0.22) {
        const lift = top.lit * MAX_LIFT
        hoverPin.setAttribute(
          'transform',
          `translate(${top.anchor[0]} ${(top.anchor[1] - lift).toFixed(2)})`,
        )
        hoverPin.setAttribute('opacity', clamp((topLit - 0.22) / 0.3, 0, 1).toFixed(2))
        active = top
      } else if (active) {
        active = null
        hoverPin.setAttribute('opacity', '0')
      }

      if (inside && mx != null && my != null) {
        poolX = lp(poolX, mx, 0.16)
        poolY = lp(poolY, my, 0.16)
        poolA = lp(poolA, 1, 0.1)
      } else {
        poolA = lp(poolA, 0, 0.08)
      }
      pool.setAttribute('cx', poolX.toFixed(1))
      pool.setAttribute('cy', poolY.toFixed(1))
      pool.setAttribute('opacity', (poolA * 0.9).toFixed(3))
      reticle.setAttribute('cx', poolX.toFixed(1))
      reticle.setAttribute('cy', poolY.toFixed(1))
      reticle.setAttribute('opacity', (poolA * 0.18).toFixed(3))
      reticle.setAttribute(
        'transform',
        `rotate(${(sunA * 22).toFixed(1)} ${poolX.toFixed(1)} ${poolY.toFixed(1)})`,
      )

      const t = (((ts - start) % DUR) / DUR)
      const dist = ease(t) * len
      const p1 = route.getPointAtLength(dist)
      const p2 = route.getPointAtLength(Math.min(len, dist + 1))
      const pa = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI
      plane.setAttribute('transform', `translate(${p1.x} ${p1.y}) rotate(${pa + 90})`)

      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)
    cleanups.push(() => cancelAnimationFrame(rafId))
  }

  cleanups.push(() => window.clearTimeout(routeTimeout))

  return () => {
    cleanups.forEach((fn) => fn())
  }
}
