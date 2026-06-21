// Core data model for City Explorer.
// Everything the UI renders comes from a City object, so adding a new city
// is just another data file in data/cities/ — no UI changes needed.

export type Category =
  | 'attraction'
  | 'food'
  | 'nightlife'
  | 'nature'
  | 'culture'
  | 'shopping'

/** Where the camera sits when framing a place or opening a city. */
export interface CameraView {
  lat: number
  lng: number
  /** Camera height above the ground, in meters. */
  height: number
  /** Compass direction the camera faces, in degrees (0 = north). */
  heading: number
  /** Tilt, in degrees. -90 looks straight down; ~-30 is a nice oblique. */
  pitch: number
}

/** A labelled key→value stat shown in the detail panel's "Info" section. */
export interface PlaceStat {
  label: string
  value: string
}

/** Emoji + label chip shown on the card (e.g. 🏛 Historic, 🌉 Engineering). */
export interface PlaceTag {
  emoji: string
  label: string
}

/** A "Look Closer" sub-point of interest around a main place. */
export interface SubPOI {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  view: CameraView
}

/** One of 3 nearby highlights shown at the bottom of a place card. */
export interface NearbyHighlight {
  name: string
  distance: string
  whyVisit: string
  category: Category
}

/** Neighborhood/area stats shown in the Area Info sidebar during tours. */
export interface AreaInfo {
  name: string
  population?: string
  density?: string
  medianIncome?: string
  industries?: string[]
  climate?: string
  character?: string
  famousFor?: string[]
}

/** Content for the "Local Context" tab — neighborhood feel + surrounding area. */
export interface LocalContext {
  text: string
  stats?: PlaceStat[]
}

export interface Place {
  id: string
  name: string
  category: Category
  lat: number
  lng: number
  /** A friendly sentence or two on why you'd go. */
  blurb: string
  /** Primary photo URL (hero image). */
  image?: string
  /** Additional gallery photos (shown in swipeable gallery). */
  images?: string[]
  /** A few quick facts shown as chips on the detail card. */
  facts?: string[]
  /** Semantic tags shown as chips (🏛 Historic, 🌉 Engineering, etc.). */
  tags?: PlaceTag[]

  // ── Richer, informative detail (all optional; shown in panel sections) ──
  /** A short paragraph of real history / context. */
  history?: string
  /** Concrete reasons / things to do here. */
  whyVisit?: string[]
  /** Labelled stats (founded, size, cost, etc.). */
  stats?: PlaceStat[]
  /** How to actually get here (transit/driving). */
  gettingThere?: string
  /** Best time to go. */
  bestTime?: string
  /** An insider tip a local would tell you. */
  localTip?: string
  /** Local context tab: surrounding neighborhood + area culture. */
  localContext?: LocalContext
  /** "Look Closer" sub-points of interest around this place. */
  subPOIs?: SubPOI[]
  /** Up to 3 nearby highlights shown at the bottom of the card. */
  nearby?: NearbyHighlight[]

  /** Camera framing used when flying to this place. */
  view: CameraView
}

/** A point on a tour's ride path: just a coordinate the camera/train travels through. */
export interface RoutePoint {
  lat: number
  lng: number
}

export interface TourStop {
  placeId: string
  /**
   * Narration beats shown at this stop — the user advances through them before
   * moving to the next stop. A single string is treated as one beat.
   */
  narration: string | string[]
  /** A short "don't miss" tip surfaced on the station card. */
  tip?: string
  /** A surprising "did you know?" nugget revealed on tap. */
  funFact?: string
  /** Optional override; falls back to the place's own view. */
  view?: CameraView
  /** Area info shown in the sidebar while at this stop. */
  areaInfo?: AreaInfo
  /** Shown in the flight HUD while flying toward this stop. */
  flyingOver?: string
}

export interface Tour {
  id: string
  name: string
  blurb: string
  stops: TourStop[]
  /**
   * Ordered path the ride travels (a smoothed spline is built from these).
   * Typically traces a real transit line. Stops should sit on/near the route.
   */
  route: RoutePoint[]
}

export type CityStatus = 'ready' | 'coming-soon'

export interface City {
  id: string
  name: string
  /** A short hook shown on the city card. */
  tagline: string
  status: CityStatus
  /** Camera shot the map opens on. */
  intro: CameraView
  places: Place[]
  tours: Tour[]
}
