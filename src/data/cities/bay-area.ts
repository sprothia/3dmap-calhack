import type { City, Place, CameraView } from '../types'

// The one fully-working city in v1.
// Coordinates are approximate; camera views use sensible default framing.
// Photos use Wikimedia Commons Special:FilePath (stable, resolves by filename).

// view.height = distance from the spot (meters); pitch = look-down angle.
/** Frame a place from ~450m out, looking down 40°, from the given heading. */
function defaultView(lat: number, lng: number, heading = 0): CameraView {
  return { lat, lng, height: 450, heading, pitch: -40 }
}

const places: Place[] = [
  // ───────────── San Francisco ─────────────
  {
    id: 'ferry-building',
    name: 'Ferry Building',
    category: 'food',
    lat: 37.7955,
    lng: -122.3937,
    blurb:
      'A grand 1898 transit hall turned food lover’s playground — local cheese, oysters, and coffee, with a farmers market out front three days a week.',
    facts: ['Built 1898', 'Marketplace + ferries', 'Saturday farmers market'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/San_Francisco_Ferry_Building_%28cropped%29.jpg?width=640',
    history:
      'Opened in 1898, the Ferry Building was once the busiest transit hub on the West Coast — up to 50,000 commuters a day before the bridges were built. After decades hidden behind a freeway, a 2003 restoration turned it into a celebrated food marketplace.',
    whyVisit: [
      'Browse artisan food stalls in the grand nave',
      'Hit the Saturday farmers market out front',
      'Still catch a real ferry to Sausalito or the East Bay',
    ],
    stats: [
      { label: 'Opened', value: '1898' },
      { label: 'Clock tower', value: '245 ft' },
      { label: 'Peak commuters', value: '~50,000/day (1930s)' },
    ],
    gettingThere:
      'The hub itself — Muni Metro, historic streetcars, BART (Embarcadero), and ferries all meet here.',
    bestTime: 'Saturday morning for the full farmers market.',
    localTip: 'Hog Island oysters at the back bar, with the bay right outside.',
    view: defaultView(37.7955, -122.3937, 250),
  },
  {
    id: 'golden-gate-bridge',
    name: 'Golden Gate Bridge',
    category: 'attraction',
    lat: 37.8199,
    lng: -122.4783,
    blurb:
      'The Bay’s signature: a burnt-orange suspension bridge that slips in and out of the fog. Walk it, bike it, or watch it glow at sunset.',
    facts: ['Opened 1937', '1.7 miles long', 'Color: International Orange'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Golden_Gate_Bridge_as_seen_from_Battery_East.jpg?width=640',
    history:
      'When it opened in 1937 it was the longest suspension bridge in the world. Engineer Joseph Strauss spent over a decade fighting skeptics who said a span across the foggy, current-ripped strait was impossible. It held the length record for 27 years.',
    whyVisit: [
      'Walk or bike across the 1.7-mile span over the water',
      'Catch the classic view from the Marin Headlands to the north',
      'Watch the towers vanish into the afternoon fog',
    ],
    stats: [
      { label: 'Opened', value: 'May 1937' },
      { label: 'Length', value: '1.7 miles (2.7 km)' },
      { label: 'Towers', value: '746 ft tall' },
      { label: 'Color', value: 'International Orange' },
    ],
    gettingThere:
      'Muni bus 28 to the toll plaza, or drive/bike across. The Marin (north) side has the best photo viewpoints.',
    bestTime: 'Early morning for clear skies; late afternoon to watch fog roll in.',
    localTip:
      'Locals shoot it from Battery Spencer in Marin — you look down the whole span with the city behind it.',
    view: { lat: 37.8199, lng: -122.4783, height: 900, heading: 200, pitch: -25 },
  },
  {
    id: 'painted-ladies',
    name: 'Painted Ladies',
    category: 'culture',
    lat: 37.7762,
    lng: -122.4329,
    blurb:
      'A row of pastel Victorian houses on Alamo Square, framed by the downtown skyline — the postcard everyone takes.',
    facts: ['Built 1892–1896', 'Alamo Square', 'Victorian “Painted Ladies”'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Painted_Ladies_San_Francisco_January_2013_panorama_2.jpg?width=640',
    history:
      'This row of seven Victorian houses on Steiner Street was built between 1892 and 1896. Their bright multi-color paint jobs — which earned the “Painted Ladies” nickname in the 1970s — set against the modern skyline make them an icon of the city.',
    whyVisit: [
      'Snap the postcard shot from Alamo Square park',
      'Picnic on the hill with the skyline view',
      'Spot them in the “Full House” opening credits',
    ],
    stats: [
      { label: 'Built', value: '1892–1896' },
      { label: 'Houses', value: '7 (“Postcard Row”)' },
      { label: 'Style', value: 'Queen Anne Victorian' },
    ],
    gettingThere: 'Muni bus 5 or 21 to Alamo Square; street parking is tough.',
    bestTime: 'Late afternoon, when the sun lights the facades.',
    localTip: 'Climb to the top of the park — the higher view lines up the skyline better.',
    view: defaultView(37.7762, -122.4329, 90),
  },
  {
    id: 'pier-39',
    name: 'Pier 39',
    category: 'attraction',
    lat: 37.8087,
    lng: -122.4098,
    blurb:
      'A boardwalk of shops and snacks where a colony of sea lions has happily taken over the docks. Loud, salty, and fun.',
    facts: ['Sea lions since 1989', 'Fisherman’s Wharf', 'Bay cruises depart here'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Pier_39_in_2021.jpg?width=640',
    history:
      'Pier 39 opened in 1978 on a reclaimed cargo pier. Its fame came by accident: months after the 1989 Loma Prieta earthquake, dozens of California sea lions hauled out onto the marina docks and never left. Today hundreds bask here.',
    whyVisit: [
      'Watch (and hear) the sea lions on K-Dock',
      'Grab clam chowder in a sourdough bowl',
      'Hop a bay cruise or the ferry to Alcatraz nearby',
    ],
    stats: [
      { label: 'Opened', value: '1978' },
      { label: 'Sea lions', value: 'up to 900 in winter' },
      { label: 'Visitors', value: '~15 million/year' },
    ],
    gettingThere: 'Historic F-line streetcar along the Embarcadero, or Muni 8.',
    bestTime: 'Winter mornings — the most sea lions are hauled out.',
    localTip:
      'Skip the chain restaurants on the pier; walk west to the wharf for better seafood.',
    view: defaultView(37.8087, -122.4098, 180),
  },
  {
    id: 'lombard-street',
    name: 'Lombard Street',
    category: 'attraction',
    lat: 37.8021,
    lng: -122.4187,
    blurb:
      'The “crookedest street” — eight tight switchbacks down a steep block, lined with flowers and very patient drivers.',
    facts: ['Eight hairpin turns', 'Built 1922', 'Russian Hill'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Lombard_Street_2020.jpg?width=640',
    view: defaultView(37.8021, -122.4187, 300),
  },
  {
    id: 'coit-tower',
    name: 'Coit Tower',
    category: 'culture',
    lat: 37.8024,
    lng: -122.4058,
    blurb:
      'An Art Deco column atop Telegraph Hill with sweeping bay views and 1930s murals wrapping the lobby.',
    facts: ['Built 1933', '210 ft tall', 'WPA-era murals inside'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Coit_Tower_1.jpg?width=640',
    view: defaultView(37.8024, -122.4058, 200),
  },
  {
    id: 'chinatown',
    name: 'Chinatown',
    category: 'culture',
    lat: 37.7941,
    lng: -122.4078,
    blurb:
      'The oldest Chinatown in North America — dragon gate, dim sum, herbal shops, and lanterns strung over Grant Avenue.',
    facts: ['Est. 1848', 'Oldest in N. America', 'Dragon Gate entrance'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/San_Francisco_China_Town_MC.jpg?width=640',
    view: defaultView(37.7941, -122.4078, 180),
  },
  {
    id: 'twin-peaks',
    name: 'Twin Peaks',
    category: 'nature',
    lat: 37.7544,
    lng: -122.4477,
    blurb:
      'Two hills near the city’s center with the best 360° view in town — the whole Bay laid out, fog permitting.',
    facts: ['922 ft summit', 'City-center viewpoint', 'Best at sunset'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Twin_Peaks_2022_Aerial.png?width=640',
    history:
      'These two undeveloped hills near the geographic center of San Francisco rise to about 922 feet — among the highest points in the city. Left wild while the rest of SF was built up, they offer the broadest view in town.',
    whyVisit: [
      'See a full 360° panorama of the Bay',
      'Spot both bridges and the ocean on a clear day',
      'Come at night for the city lights',
    ],
    stats: [
      { label: 'Elevation', value: '922 ft (281 m)' },
      { label: 'View', value: '360° of the Bay' },
    ],
    gettingThere: 'Drive or bike up Twin Peaks Blvd; Muni 37 gets you close.',
    bestTime: 'Sunset on a clear day — but check the fog first.',
    localTip:
      'The lower viewing area is less crowded and just as good as the summit lot.',
    view: { lat: 37.7544, lng: -122.4477, height: 700, heading: 20, pitch: -30 },
  },
  {
    id: 'mission-dolores-park',
    name: 'Mission Dolores Park',
    category: 'nature',
    lat: 37.7596,
    lng: -122.4269,
    blurb:
      'The city’s favorite sunny lawn — picnics, dogs, and a skyline view, in the heart of the Mission’s taquerías and murals.',
    facts: ['Opened 1905', 'Skyline views', 'Mission District'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Dolores_Park_May_2025.jpg?width=640',
    view: defaultView(37.7596, -122.4269, 40),
  },
  {
    id: 'lands-end',
    name: 'Lands End',
    category: 'nature',
    lat: 37.7804,
    lng: -122.5057,
    blurb:
      'A windswept coastal trail through cypress trees with surprise views of the bridge and the ruins of the old Sutro Baths.',
    facts: ['Coastal trail', 'Sutro Baths ruins', 'Labyrinth overlook'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Coastal_Trail_and_Golden_Gate_Bridge%2C_April_2019.JPG?width=640',
    history:
      'Lands End is the rugged northwest corner of the city, where the Pacific meets the Golden Gate. Its rocky shore has wrecked dozens of ships. Nearby stand the ruins of the Sutro Baths, a vast 1896 swimming palace that burned in 1966.',
    whyVisit: [
      'Hike the cypress-lined Coastal Trail',
      'Explore the eerie Sutro Baths ruins',
      'Find the stone labyrinth on the bluff',
    ],
    stats: [
      { label: 'Trail', value: '~3.4 mi round trip' },
      { label: 'Sutro Baths', value: 'opened 1896' },
    ],
    gettingThere: 'Muni 38 to 48th Ave, or drive to the Lands End lookout lot.',
    bestTime: 'Clear afternoons for bridge views; low tide to see shipwrecks.',
    localTip: 'The Labyrinth at Eagle’s Point is easy to miss — look for the side path.',
    view: defaultView(37.7804, -122.5057, 130),
  },
  {
    id: 'golden-gate-park',
    name: 'Golden Gate Park',
    category: 'nature',
    lat: 37.7694,
    lng: -122.4862,
    blurb:
      'A thousand acres of gardens, lakes, bison, and museums stretching to the ocean — bigger than Central Park.',
    facts: ['1,017 acres', 'Opened 1871', 'Bison paddock + museums'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/California-06241_-_In_front_of_museum_%2820449897948%29.jpg?width=640',
    history:
      'Begun in 1871 on barren sand dunes, Golden Gate Park was an act of sheer will — gardener John McLaren spent 56 years turning windswept dunes into a thousand acres of greenery. At 1,017 acres it’s 20% larger than NYC’s Central Park.',
    whyVisit: [
      'See the de Young Museum and California Academy of Sciences',
      'Visit the bison paddock and Japanese Tea Garden',
      'Bike car-free JFK Drive on weekends to the ocean',
    ],
    stats: [
      { label: 'Size', value: '1,017 acres' },
      { label: 'Opened', value: '1871' },
      { label: 'Visitors', value: '~24 million/year' },
    ],
    gettingThere: 'Muni 5, 7, 28, or N-Judah line along the edges.',
    bestTime: 'Weekend mornings, when JFK Drive is closed to cars.',
    localTip: 'The free botanical garden and the bison are the most underrated stops.',
    view: defaultView(37.7694, -122.4862, 90),
  },
  {
    id: 'oracle-park',
    name: 'Oracle Park',
    category: 'attraction',
    lat: 37.7786,
    lng: -122.3893,
    blurb:
      'The Giants’ waterfront ballpark, where home runs splash into McCovey Cove and kayakers wait with nets.',
    facts: ['Opened 2000', 'SF Giants', 'McCovey Cove splash hits'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Oracle_Park_2021.jpg?width=640',
    history:
      'Opened in 2000 as the Giants’ first privately financed ballpark in decades, it sits right on the bay. Its short right-field wall drops straight into the water, creating “McCovey Cove,” where kayakers wait to fish out home-run balls.',
    whyVisit: [
      'Catch a Giants game with bay views',
      'Walk the free public promenade behind right field',
      'Watch kayakers chase “splash hits” into the cove',
    ],
    stats: [
      { label: 'Opened', value: '2000' },
      { label: 'Capacity', value: '~41,300' },
      { label: 'Splash hits', value: '100+' },
    ],
    gettingThere: 'Muni N-Judah and T-Third stop right outside; walkable from downtown.',
    bestTime: 'A day game so you can see the bay; arrive early for the promenade.',
    localTip: 'You can watch a few innings free from the right-field archways.',
    view: defaultView(37.7786, -122.3893, 220),
  },
  {
    id: 'castro-district',
    name: 'The Castro',
    category: 'nightlife',
    lat: 37.7609,
    lng: -122.435,
    blurb:
      'The heart of LGBTQ+ San Francisco — rainbow crosswalks, the historic Castro Theatre, and bars that spill onto the sidewalks after dark.',
    facts: ['Rainbow crosswalks', 'Castro Theatre (1922)', 'Lively nightlife'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Castro%2C_San_Francisco%2C_CA.jpg?width=640',
    view: defaultView(37.7609, -122.435, 90),
  },
  {
    id: 'north-beach',
    name: 'North Beach',
    category: 'nightlife',
    lat: 37.7999,
    lng: -122.4097,
    blurb:
      'SF’s “Little Italy” and old Beat-poet haunt — espresso bars by day, lively trattorias and neon-lit bars on Broadway by night.',
    facts: ['Little Italy', 'Beat Generation home', 'Broadway bar strip'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/North_Beach%2C_San_Francisco.jpg?width=640',
    view: defaultView(37.7999, -122.4097, 180),
  },
  {
    id: 'mission-nightlife',
    name: 'Mission District',
    category: 'nightlife',
    lat: 37.7599,
    lng: -122.4148,
    blurb:
      'The city’s most electric nightlife: muraled alleys, taquerías open late, craft-cocktail dens, and dive bars along Valencia and Mission Streets.',
    facts: ['Murals + nightlife', 'Valencia St bars', 'Best late-night tacos'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Mission_High_School_%28cropped%29.jpg?width=640',
    view: defaultView(37.7599, -122.4148, 90),
  },

  // ───────────── North Bay ─────────────
  {
    id: 'sausalito',
    name: 'Sausalito',
    category: 'nature',
    lat: 37.8591,
    lng: -122.4853,
    blurb:
      'A breezy harbor town just across the bridge — houseboats, art galleries, and a Mediterranean feel looking back at the city.',
    facts: ['Across the bridge', 'Famous houseboats', 'Ferry from SF'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Sausalito.jpg?width=640',
    view: defaultView(37.8591, -122.4853, 160),
  },
  {
    id: 'muir-woods',
    name: 'Muir Woods',
    category: 'nature',
    lat: 37.8959,
    lng: -122.5808,
    blurb:
      'A hushed grove of old-growth coast redwoods just north of the city — some over 250 feet tall and a thousand years old.',
    facts: ['Old-growth redwoods', 'Up to 258 ft tall', 'Nat’l Monument 1908'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Muir_Woods_National_Monument_%2847879029461%29.jpg?width=640',
    view: defaultView(37.8959, -122.5808, 0),
  },

  // ───────────── Peninsula (Caltrain corridor) ─────────────
  {
    id: 'sf-caltrain',
    name: 'San Francisco Station',
    category: 'attraction',
    lat: 37.7765,
    lng: -122.3947,
    blurb:
      'The northern terminus of Caltrain at 4th & King — where the Peninsula commute begins. All aboard southbound.',
    facts: ['4th & King', 'Caltrain terminus', 'Northern end of the line'],
    view: defaultView(37.7765, -122.3947, 180),
  },
  {
    id: 'millbrae',
    name: 'Millbrae',
    category: 'attraction',
    lat: 37.6,
    lng: -122.3869,
    blurb:
      'A key transfer point where Caltrain meets BART and SFO is a stop away — gateway between the city and the airport.',
    facts: ['Caltrain + BART', 'Near SFO', 'Major transfer hub'],
    view: defaultView(37.6, -122.3869, 180),
  },
  {
    id: 'burlingame',
    name: 'Burlingame',
    category: 'shopping',
    lat: 37.5793,
    lng: -122.345,
    blurb:
      'A leafy downtown of cafés and boutiques along Burlingame Avenue, with the bay shoreline trail just to the east.',
    facts: ['Burlingame Ave', 'Tree-lined downtown', 'Bayfront trail'],
    view: defaultView(37.5793, -122.345, 180),
  },
  {
    id: 'san-mateo',
    name: 'San Mateo',
    category: 'nature',
    lat: 37.5685,
    lng: -122.3239,
    blurb:
      'The Peninsula’s busy midpoint — a walkable downtown, Central Park’s Japanese garden, and great mixed food.',
    facts: ['Central Park garden', 'Walkable downtown', 'Peninsula midpoint'],
    view: defaultView(37.5685, -122.3239, 180),
  },
  {
    id: 'redwood-city',
    name: 'Redwood City',
    category: 'food',
    lat: 37.4855,
    lng: -122.2319,
    blurb:
      'Once a sleepy port, now a buzzing downtown of restaurants, a movie plaza, and the slogan “Climate Best by Government Test.”',
    facts: ['Lively dining plaza', 'Deep-water port', 'Sunny microclimate'],
    view: defaultView(37.4855, -122.2319, 180),
  },
  {
    id: 'menlo-park',
    name: 'Menlo Park',
    category: 'culture',
    lat: 37.4548,
    lng: -122.1825,
    blurb:
      'A quiet, affluent town that’s home to Meta’s campus and the birthplace ground of much of Silicon Valley venture capital.',
    facts: ['Meta HQ nearby', 'Sand Hill Road VCs', 'Tree-lined streets'],
    view: defaultView(37.4548, -122.1825, 180),
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    category: 'culture',
    lat: 37.4275,
    lng: -122.1697,
    blurb:
      'Sandstone arcades, palm-lined drives, and the Hoover Tower — a campus that feels like a small sunlit city of its own.',
    facts: ['Founded 1885', '8,180 acres', 'Hoover Tower landmark'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/MCB-san-mateo-aerial_%28cropped%29.jpg?width=640',
    view: defaultView(37.4275, -122.1697, 0),
  },
  {
    id: 'palo-alto-downtown',
    name: 'Downtown Palo Alto',
    category: 'shopping',
    lat: 37.4441,
    lng: -122.1607,
    blurb:
      'University Avenue’s leafy strip of cafés and bookshops — the unofficial main street of Silicon Valley.',
    facts: ['University Ave', 'Next to Stanford', 'Startup birthplace'],
    view: defaultView(37.4441, -122.1607, 90),
  },
  {
    id: 'mountain-view-castro',
    name: 'Castro Street, Mountain View',
    category: 'food',
    lat: 37.3939,
    lng: -122.0797,
    blurb:
      'A walkable downtown packed with food from every corner of the world — the South Bay’s best casual eating in one stretch.',
    facts: ['Global food street', 'Walkable downtown', 'Googleplex nearby'],
    view: defaultView(37.3939, -122.0797, 0),
  },
  {
    id: 'san-jose-diridon',
    name: 'San Jose (Diridon)',
    category: 'attraction',
    lat: 37.3297,
    lng: -121.9028,
    blurb:
      'The southern end of the line — a historic 1935 station and the gateway to downtown San Jose, the valley’s biggest city.',
    facts: ['Built 1935', 'Southern terminus', 'Gateway to San Jose'],
    view: defaultView(37.3297, -121.9028, 0),
  },
]

export const bayArea: City = {
  id: 'bay-area',
  name: 'Bay Area',
  tagline: 'Fog, bridges, and a city by the water',
  status: 'ready',
  // High, tilted shot looking south down the Peninsula.
  intro: {
    lat: 37.77,
    lng: -122.43,
    height: 9000,
    heading: 20,
    pitch: -45,
  },
  places,
  tours: [
    {
      id: 'bay-flyover',
      name: 'Bay Area from Above',
      blurb:
        'Take to the sky for a scenic flight over the Bay’s greatest hits — soar past the Golden Gate, bank over the city, and glide along the coast.',
      // Aerial path linking the marquee sights (a smooth arc, not a rail line).
      route: [
        { lat: 37.8199, lng: -122.4783 }, // Golden Gate Bridge
        { lat: 37.8083, lng: -122.4098 }, // Pier 39 / waterfront
        { lat: 37.8024, lng: -122.4058 }, // Coit Tower / Telegraph Hill
        { lat: 37.7955, lng: -122.3937 }, // Ferry Building
        { lat: 37.7786, lng: -122.3893 }, // Oracle Park
        { lat: 37.7596, lng: -122.4269 }, // Mission / Dolores
        { lat: 37.7762, lng: -122.4329 }, // Painted Ladies / Alamo Sq
        { lat: 37.7544, lng: -122.4477 }, // Twin Peaks
        { lat: 37.7694, lng: -122.4862 }, // Golden Gate Park
        { lat: 37.7804, lng: -122.5057 }, // Lands End
      ],
      stops: [
        {
          placeId: 'golden-gate-bridge',
          narration: [
            'Welcome aboard your aerial tour of the Bay! We’re lifting off right over the Golden Gate Bridge — the Bay’s front door.',
            'Below us, fog often pours through the strait like a slow-motion waterfall. From up here you can see why this is the most photographed bridge on earth.',
          ],
          tip: 'The Marin side (north) has the classic postcard viewpoint.',
          funFact:
            'The bridge isn’t gold — it’s “International Orange,” chosen so ships could see it in the Bay’s thick fog.',
        },
        {
          placeId: 'pier-39',
          narration: [
            'Banking east along the northern waterfront — that’s Fisherman’s Wharf and Pier 39 below.',
            'Hear the barking? A colony of sea lions took over these docks in 1989 and never left. The whole shoreline here is seafood, sailboats, and salt air.',
          ],
          tip: 'Boats to Alcatraz leave from Pier 33, just east of here.',
          funFact:
            'The Pier 39 sea lions showed up right after the 1989 earthquake — no one knows exactly why they chose this spot.',
        },
        {
          placeId: 'ferry-building',
          narration: [
            'Gliding over the Embarcadero now. That clock tower is the Ferry Building, the city’s grand old front porch on the water.',
            'Once the second-busiest transit terminal in the world, today it’s a temple to Bay Area food — and the bay laps right at its feet.',
          ],
          tip: 'Time your visit for the Saturday farmers market.',
          funFact:
            'Its 245-foot clock tower survived both the 1906 and 1989 earthquakes with the clock still keeping time.',
        },
        {
          placeId: 'oracle-park',
          narration: [
            'Curving south to the water’s edge — there’s Oracle Park, home of the Giants.',
            'Right field opens onto the bay, so a big home run splashes into “McCovey Cove,” where kayakers paddle around waiting to scoop up the ball.',
          ],
          tip: 'Even non-fans love the bayfront promenade behind right field.',
          funFact:
            'Over 100 “splash hit” home runs have landed in the cove since the park opened in 2000.',
        },
        {
          placeId: 'painted-ladies',
          narration: [
            'Heading inland over the rooftops — and there’s the row of pastel Victorians known as the Painted Ladies.',
            'With the downtown skyline rising behind them, this is the most painted, filmed, and postcarded block in the whole city.',
          ],
          tip: 'Alamo Square park, right in front, is the spot for the photo.',
          funFact:
            'About 48,000 ornate Victorians were built in SF before 1915 — many were lost in 1906, making the survivors precious.',
        },
        {
          placeId: 'twin-peaks',
          narration: [
            'Climbing now to the city’s rooftop — Twin Peaks, nearly dead center in San Francisco.',
            'On a clear day you can see the whole Bay from up here: both bridges, the ocean, the East Bay hills. It’s the best 360° view in town.',
          ],
          tip: 'Go at sunset — but bring a jacket, it’s windy and cool.',
          funFact:
            'The Spanish called these hills “Los Pechos de la Chola.” They’re among the few SF summits left undeveloped.',
        },
        {
          placeId: 'golden-gate-park',
          narration: [
            'Soaring west over a vast green rectangle — that’s Golden Gate Park, bigger than New York’s Central Park.',
            'Built on what were once windswept sand dunes, it now holds museums, lakes, a bison paddock, and gardens, running all the way to the ocean.',
          ],
          tip: 'It’s car-free on JFK Drive on weekends — rent a bike.',
          funFact:
            'A herd of bison has lived in the park since 1891 — you can still see them grazing today.',
        },
        {
          placeId: 'lands-end',
          narration: [
            'Our final approach, out to the wild western edge — Lands End, where the city meets the open Pacific.',
            'Cypress-lined trails, shipwreck-strewn surf, and surprise views of the bridge. A fitting place to bring our flight in to land. Thanks for flying the Bay!',
          ],
          tip: 'The Lands End Labyrinth overlook is a hidden gem.',
          funFact:
            'The rocks below have wrecked dozens of ships — at very low tide you can still spot rusting hulls.',
        },
      ],
    },
  ],
}
