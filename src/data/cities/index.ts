import type { City } from '../types'
import { bayArea } from './bay-area'

// A "coming soon" city needs only an id, name, tagline, and status.
// When one becomes real, import its full City object here instead.
function comingSoon(id: string, name: string, tagline: string): City {
  return {
    id,
    name,
    tagline,
    status: 'coming-soon',
    intro: { lat: 0, lng: 0, height: 0, heading: 0, pitch: 0 },
    places: [],
    tours: [],
  }
}

export const cities: City[] = [
  bayArea,
  comingSoon('los-angeles', 'Los Angeles', 'Sun, sprawl, and the Pacific'),
  comingSoon('new-york', 'New York', 'Five boroughs, one island'),
  comingSoon('seattle', 'Seattle', 'Mountains, water, and coffee'),
]

export function getCity(id: string): City | undefined {
  return cities.find((c) => c.id === id)
}
