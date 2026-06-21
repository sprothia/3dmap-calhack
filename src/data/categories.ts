import type { Category } from './types'

export const CATEGORY_LABEL: Record<Category, string> = {
  attraction: 'Hot Attractions',
  food: 'Food & Drink',
  nightlife: 'Nightlife',
  nature: 'Nature & Outdoors',
  culture: 'Arts & Culture',
  shopping: 'Shopping',
}

export const CATEGORY_EMOJI: Record<Category, string> = {
  attraction: '🔥',
  food: '🍴',
  nightlife: '🌃',
  nature: '🌲',
  culture: '🎨',
  shopping: '🛍️',
}

// One vivid color per category, used for pins, swatches, and chips.
export const CATEGORY_COLOR: Record<Category, string> = {
  attraction: '#E8473B', // red
  food: '#F2911B', // orange
  nightlife: '#8B5CF6', // purple
  nature: '#3FA66A', // green
  culture: '#3B82C4', // blue
  shopping: '#EC4899', // pink
}

// Tailwind chip classes (bg tint + text) matching the colors above.
export const CATEGORY_CHIP: Record<Category, string> = {
  attraction: 'bg-[#E8473B]/15 text-[#E8473B]',
  food: 'bg-[#F2911B]/15 text-[#c4720f]',
  nightlife: 'bg-[#8B5CF6]/15 text-[#7c3aed]',
  nature: 'bg-[#3FA66A]/15 text-[#2f8050]',
  culture: 'bg-[#3B82C4]/15 text-[#3B82C4]',
  shopping: 'bg-[#EC4899]/15 text-[#db2777]',
}

export const ALL_CATEGORIES: Category[] = [
  'attraction',
  'food',
  'nightlife',
  'nature',
  'culture',
  'shopping',
]
