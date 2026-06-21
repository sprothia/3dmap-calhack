import type { City, Place, CameraView } from '../types'

// The one fully-working city in v1.
// Coordinates are approximate; camera views use sensible default framing.
// Photos use Wikimedia Commons Special:FilePath (stable, resolves by filename).

// view.height = distance from the spot (meters); pitch = look-down angle.
/** Frame a place from ~450m out, looking down 40 deg, from the given heading. */
function defaultView(lat: number, lng: number, heading = 0): CameraView {
  return { lat, lng, height: 450, heading, pitch: -40 }
}

const places: Place[] = [
  // --- San Francisco ---
  {
    id: 'ferry-building',
    name: 'Ferry Building',
    category: 'food',
    lat: 37.7955,
    lng: -122.3937,
    blurb:
      'A grand 1898 transit hall turned food lover\'s playground -- local cheese, oysters, and coffee, with a farmers market out front three days a week.',
    facts: ['Built 1898', 'Marketplace + ferries', 'Saturday farmers market'],
    tags: [
      { emoji: '🏛', label: 'Historic' },
      { emoji: '🍜', label: 'Food' },
      { emoji: '🌊', label: 'Waterfront' },
      { emoji: '📸', label: 'Photography' },
    ],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/San_Francisco_Ferry_Building_%28cropped%29.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Embarcadero_San_Francisco.jpg?width=640',
    ],
    history:
      'Opened in 1898, the Ferry Building was once the busiest transit hub on the West Coast -- up to 50,000 commuters a day before the bridges were built. After decades hidden behind a freeway, a 2003 restoration turned it into a celebrated food marketplace.',
    whyVisit: [
      'Browse artisan food stalls in the grand nave',
      'Hit the Saturday farmers market out front',
      'Still catch a real ferry to Sausalito or the East Bay',
    ],
    stats: [
      { label: 'Opened', value: '1898' },
      { label: 'Clock tower', value: '245 ft' },
      { label: 'Peak commuters', value: '~50,000/day (1930s)' },
      { label: 'Vendors', value: '40+ artisan stalls' },
    ],
    gettingThere:
      'The hub itself -- Muni Metro, historic streetcars, BART (Embarcadero), and ferries all meet here.',
    bestTime: 'Saturday morning for the full farmers market.',
    localTip: 'Hog Island oysters at the back bar, with the bay right outside.',
    localContext: {
      text: 'The Ferry Building anchors the Embarcadero waterfront, SF\'s main boulevard running the bay shore. The surrounding FiDi and SoMa districts pulse with finance and tech by day; the promenade draws joggers, cyclists, and tourists all day long.',
      stats: [
        { label: 'Neighborhood', value: 'Embarcadero / FiDi' },
        { label: 'Vibe', value: 'Foodie + waterfront + commuter hub' },
        { label: 'Transit', value: 'BART, Muni, ferries, F-line streetcar' },
      ],
    },
    nearby: [
      { name: 'Embarcadero Center', distance: '0.2 mi', whyVisit: 'Four connected towers with 125 shops and restaurants joined by skybridge walkways -- great for a rainy-day wander.', category: 'shopping' },
      { name: 'Justin Herman Plaza', distance: '0.1 mi', whyVisit: 'Home of the Vaillancourt Fountain and prime food-truck territory -- the best people-watching on the bay.', category: 'culture' },
      { name: 'Hog Island Oyster Bar', distance: '0 mi (inside)', whyVisit: 'The bay oyster bar inside the building is genuinely one of the best in the country -- pair with a glass of California white and a bay view.', category: 'food' },
    ],
    subPOIs: [
      { id: 'ferry-clock-tower', name: 'Clock Tower', description: '245 ft Beaux Arts tower -- survived both the 1906 and 1989 earthquakes', lat: 37.7956, lng: -122.3935, view: { lat: 37.7956, lng: -122.3935, height: 150, heading: 200, pitch: -20 } },
      { id: 'ferry-market-nave', name: 'Market Nave', description: 'Vaulted central hall lined with 40+ artisan food stalls', lat: 37.7954, lng: -122.3938, view: { lat: 37.7954, lng: -122.3938, height: 80, heading: 90, pitch: -15 } },
      { id: 'ferry-pier', name: 'Ferry Pier', description: 'Working ferries to Sausalito, Tiburon, and the East Bay depart here', lat: 37.7953, lng: -122.393, view: { lat: 37.7953, lng: -122.393, height: 120, heading: 270, pitch: -20 } },
    ],
    view: defaultView(37.7955, -122.3937, 250),
  },
  {
    id: 'golden-gate-bridge',
    name: 'Golden Gate Bridge',
    category: 'attraction',
    lat: 37.8199,
    lng: -122.4783,
    blurb:
      'The Bay\'s signature: a burnt-orange suspension bridge that slips in and out of the fog. Walk it, bike it, or watch it glow at sunset.',
    facts: ['Opened 1937', '1.7 miles long', 'Color: International Orange'],
    tags: [
      { emoji: '🌉', label: 'Engineering' },
      { emoji: '🏛', label: 'Historic' },
      { emoji: '📸', label: 'Photography' },
      { emoji: '🚶', label: 'Walkable' },
    ],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Golden_Gate_Bridge_as_seen_from_Battery_East.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/GoldenGateBridge-001.jpg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Below_Golden_Gate_Bridge.jpeg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/GG-ftpoint-bridge-2_b.jpg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/GG-bridge-cable.jpg?width=640',
    ],
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
      { label: 'Construction', value: '4 years, 11 months' },
      { label: 'Daily crossings', value: '~112,000 vehicles' },
    ],
    gettingThere:
      'Muni bus 28 to the toll plaza, or drive/bike across. The Marin (north) side has the best photo viewpoints.',
    bestTime: 'Early morning for clear skies; late afternoon to watch fog roll in.',
    localTip:
      'Locals shoot it from Battery Spencer in Marin -- you look down the whole span with the city behind it.',
    localContext: {
      text: 'The bridge spans the Golden Gate strait -- the only ocean inlet to SF Bay. South is the Presidio, a former military base turned national park. North is the Marin Headlands with dramatic coastal cliffs. The surrounding area is almost entirely parkland -- one of the most scenic bridge approaches on earth.',
      stats: [
        { label: 'South shore', value: 'Presidio National Park' },
        { label: 'North shore', value: 'Marin Headlands' },
        { label: 'Strait width', value: '1 mile' },
        { label: 'Water depth', value: 'Up to 372 ft' },
      ],
    },
    nearby: [
      { name: 'Battery Spencer', distance: '0.8 mi (Marin)', whyVisit: 'The ultimate GGB viewpoint -- look down the whole span from a WWII artillery battery perched above the bridge. Worth the drive.', category: 'nature' },
      { name: 'Crissy Field', distance: '0.6 mi (SF)', whyVisit: 'A restored tidal marsh and beach with an unobstructed bridge view -- perfect for a sunrise run or kite-flying afternoon.', category: 'nature' },
      { name: 'Warming Hut Cafe', distance: '0.7 mi', whyVisit: 'Cozy cafe on the bay shore -- locally sourced snacks and the best coffee between the bridge and the Presidio.', category: 'food' },
    ],
    subPOIs: [
      { id: 'ggb-south-tower', name: 'South Tower', description: '746 ft tall -- walk to its base on the pedestrian path', lat: 37.8169, lng: -122.4783, view: { lat: 37.8169, lng: -122.4783, height: 300, heading: 180, pitch: -20 } },
      { id: 'ggb-cables', name: 'Main Cables', description: '36 inches thick, made of 27,572 individual wires each', lat: 37.8199, lng: -122.4783, view: { lat: 37.8199, lng: -122.4783, height: 600, heading: 90, pitch: -15 } },
      { id: 'ggb-ocean-view', name: 'Pacific View', description: 'Ships enter the Bay through this strait -- the open Pacific beyond', lat: 37.822, lng: -122.489, view: { lat: 37.822, lng: -122.489, height: 400, heading: 270, pitch: -10 } },
      { id: 'ggb-marin-side', name: 'Marin Side', description: 'North anchorage and the start of Marin\'s coastal hiking trails', lat: 37.8326, lng: -122.4795, view: { lat: 37.8326, lng: -122.4795, height: 350, heading: 180, pitch: -25 } },
    ],
    view: { lat: 37.8199, lng: -122.4783, height: 900, heading: 200, pitch: -25 },
  },
  {
    id: 'painted-ladies',
    name: 'Painted Ladies',
    category: 'culture',
    lat: 37.7762,
    lng: -122.4329,
    blurb:
      'A row of pastel Victorian houses on Alamo Square, framed by the downtown skyline -- the postcard everyone takes.',
    facts: ['Built 1892-1896', 'Alamo Square', 'Victorian "Painted Ladies"'],
    tags: [
      { emoji: '🏛', label: 'Historic' },
      { emoji: '🎨', label: 'Culture' },
      { emoji: '📸', label: 'Photography' },
    ],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Painted_Ladies_San_Francisco_January_2013_panorama_2.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Painted_ladies.jpg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Alamo_Square%2C_San_Francisco.jpg?width=640',
    ],
    history:
      'This row of seven Victorian houses on Steiner Street was built between 1892 and 1896. Their bright multi-color paint jobs -- which earned the "Painted Ladies" nickname in the 1970s -- set against the modern skyline make them an icon of the city.',
    whyVisit: [
      'Snap the postcard shot from Alamo Square park',
      'Picnic on the hill with the skyline view',
      'Spot them in the "Full House" opening credits',
    ],
    stats: [
      { label: 'Built', value: '1892-1896' },
      { label: 'Houses', value: '7 ("Postcard Row")' },
      { label: 'Style', value: 'Queen Anne Victorian' },
      { label: 'Park size', value: '12.7 acres' },
    ],
    gettingThere: 'Muni bus 5 or 21 to Alamo Square; street parking is tough.',
    bestTime: 'Late afternoon, when the sun lights the facades.',
    localTip: 'Climb to the top of the park -- the higher view lines up the skyline better.',
    localContext: {
      text: 'Alamo Square sits in the Western Addition -- one of SF\'s most architecturally rich neighborhoods. The Fillmore District is steps away, once called the "Harlem of the West" for its jazz scene. Fire breaks stopped the 1906 blaze here, saving thousands of Victorian homes that\'d been lost elsewhere.',
      stats: [
        { label: 'Neighborhood', value: 'Western Addition / Alamo Square' },
        { label: 'Surviving Victorians in SF', value: '~14,000' },
        { label: 'Nearby jazz history', value: 'Fillmore District (0.5 mi)' },
      ],
    },
    nearby: [
      { name: 'Fillmore Street', distance: '0.5 mi', whyVisit: 'Boutiques, jazz bars, and top brunch spots -- Jane on Fillmore for coffee, State Bird Provisions for a legendary dinner.', category: 'food' },
      { name: 'Haight-Ashbury', distance: '0.7 mi', whyVisit: 'Ground zero of the 1967 Summer of Love -- vintage shops, record stores, and the unmistakable energy of SF counter-culture.', category: 'culture' },
      { name: 'Nopa Restaurant', distance: '0.3 mi', whyVisit: 'Anchor of the Divisadero corridor -- packed every night for 15 years with good reason. Wood-fired cooking and a great wine list.', category: 'food' },
    ],
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
    facts: ['Sea lions since 1989', 'Fisherman\'s Wharf', 'Bay cruises depart here'],
    tags: [
      { emoji: '🌊', label: 'Waterfront' },
      { emoji: '🎭', label: 'Entertainment' },
      { emoji: '🍜', label: 'Food' },
    ],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Pier_39_in_2021.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Pier_39_at_Dusk%2C_SF%2C_CA%2C_jjron_25.03.2012.jpg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/San_Francisco_Pier_39_Old_Port_Gate.jpg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/San_Francisco_from_Forbes_Island_pier_39%2C_544.jpg?width=640',
    ],
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
      { label: 'Sea lions arrived', value: 'January 1990' },
    ],
    gettingThere: 'Historic F-line streetcar along the Embarcadero, or Muni 8.',
    bestTime: 'Winter mornings -- the most sea lions are hauled out.',
    localTip: 'Skip the chain restaurants on the pier; walk west to the wharf for better seafood.',
    localContext: {
      text: 'Pier 39 sits in Fisherman\'s Wharf, SF\'s working-waterfront-turned-tourist-heartland. Italian immigrant fishermen dominated the industry here through the mid-20th century. The salt air, crab pots, and barking sea lions give it a character that\'s hard to fake.',
      stats: [
        { label: 'Neighborhood', value: 'Fisherman\'s Wharf' },
        { label: 'Alcatraz ferry', value: 'Departs Pier 33 (0.2 mi)' },
        { label: 'Specialty', value: 'Dungeness crab, clam chowder bowls' },
      ],
    },
    nearby: [
      { name: 'Alcatraz Island', distance: '1.4 mi (ferry)', whyVisit: 'The most gripping prison tour in America -- audio guide narrated by former inmates and guards. Book weeks ahead in summer.', category: 'culture' },
      { name: 'Musee Mecanique', distance: '0.2 mi', whyVisit: 'A packed arcade of working antique coin-operated machines from the 1800s -- fortune tellers, Laugh-O-Rama clowns, old peep shows. Totally free to browse.', category: 'culture' },
      { name: 'In-N-Out (Fisherman\'s Wharf)', distance: '0.4 mi', whyVisit: 'The only waterfront In-N-Out in the world -- the bay view from the upper deck is legitimately spectacular for a $6 burger.', category: 'food' },
    ],
    view: defaultView(37.8087, -122.4098, 180),
  },
  {
    id: 'lombard-street',
    name: 'Lombard Street',
    category: 'attraction',
    lat: 37.8021,
    lng: -122.4187,
    blurb:
      'The "crookedest street" -- eight tight switchbacks down a steep block, lined with flowers and very patient drivers.',
    facts: ['Eight hairpin turns', 'Built 1922', 'Russian Hill'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Lombard_Street_2020.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/LombardStreet.jpg?width=640',
    ],
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
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/17_30_085_coit_tower.jpg?width=640',
    ],
    view: defaultView(37.8024, -122.4058, 200),
  },
  {
    id: 'chinatown',
    name: 'Chinatown',
    category: 'culture',
    lat: 37.7941,
    lng: -122.4078,
    blurb:
      'The oldest Chinatown in North America -- dragon gate, dim sum, herbal shops, and lanterns strung over Grant Avenue.',
    facts: ['Est. 1848', 'Oldest in N. America', 'Dragon Gate entrance'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/San_Francisco_China_Town_MC.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/0140_Six_Companies_%2841556221022%29.jpg?width=640',
    ],
    view: defaultView(37.7941, -122.4078, 180),
  },
  {
    id: 'twin-peaks',
    name: 'Twin Peaks',
    category: 'nature',
    lat: 37.7544,
    lng: -122.4477,
    blurb:
      'Two hills near the city\'s center with the best 360 deg view in town -- the whole Bay laid out, fog permitting.',
    facts: ['922 ft summit', 'City-center viewpoint', 'Best at sunset'],
    tags: [
      { emoji: '🏔', label: 'Scenic' },
      { emoji: '🌲', label: 'Nature' },
      { emoji: '📸', label: 'Photography' },
    ],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Twin_Peaks_2022_Aerial.png?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Twinpeaks.jpg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Twin_Peaks_Blvd_closure_pedestrian_road.jpg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/SF_From_Marin_Highlands3.jpg?width=640',
    ],
    history:
      'These two undeveloped hills near the geographic center of San Francisco rise to about 922 feet -- among the highest points in the city. Left wild while the rest of SF was built up, they offer the broadest view in town.',
    whyVisit: [
      'See a full 360 deg panorama of the Bay',
      'Spot both bridges and the ocean on a clear day',
      'Come at night for the city lights',
    ],
    stats: [
      { label: 'Elevation', value: '922 ft (281 m)' },
      { label: 'View', value: '360 deg of the Bay' },
      { label: 'Open space', value: '64 acres' },
      { label: 'Trails', value: '4 maintained paths' },
    ],
    gettingThere: 'Drive or bike up Twin Peaks Blvd; Muni 37 gets you close.',
    bestTime: 'Sunset on a clear day -- but check the fog first.',
    localTip: 'The lower viewing area is less crowded and just as good as the summit lot.',
    localContext: {
      text: 'Twin Peaks divides foggy west SF from sunnier east SF. The surrounding Castro and Noe Valley neighborhoods are among the most desirable in the city. The hills are a rare patch of native serpentine grassland -- rare soil that supports plants found almost nowhere else in SF.',
      stats: [
        { label: 'East neighbor', value: 'Castro / Eureka Valley' },
        { label: 'West neighbor', value: 'Forest Hill / West Portal' },
        { label: 'Soil type', value: 'Serpentine (supports rare native plants)' },
      ],
    },
    nearby: [
      { name: 'Castro District', distance: '0.7 mi', whyVisit: 'Beating heart of SF\'s LGBTQ+ community -- rainbow crosswalks, the 1922 Castro Theatre, and bars that have been iconic for 50 years.', category: 'nightlife' },
      { name: 'Corona Heights Park', distance: '0.5 mi', whyVisit: 'A rocky outcrop with dramatic views -- far less crowded than Twin Peaks and a favorite with locals and their dogs.', category: 'nature' },
      { name: 'Noe Valley Farmers Market', distance: '1.0 mi', whyVisit: 'Saturday morning market in a quaint residential square -- best pastries, tamales, and oysters without the Ferry Building crowds.', category: 'food' },
    ],
    view: { lat: 37.7544, lng: -122.4477, height: 700, heading: 20, pitch: -30 },
  },
  {
    id: 'mission-dolores-park',
    name: 'Mission Dolores Park',
    category: 'nature',
    lat: 37.7596,
    lng: -122.4269,
    blurb:
      'The city\'s favorite sunny lawn -- picnics, dogs, and a skyline view, in the heart of the Mission\'s taquerias and murals.',
    facts: ['Opened 1905', 'Skyline views', 'Mission District'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Dolores_Park_May_2025.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/DoloresParkPanorama.jpg?width=640',
    ],
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
    localTip: "The Labyrinth at Eagle\'s Point is easy to miss -- look for the side path.",
    tags: [
      { emoji: '🌊', label: 'Coastal' },
      { emoji: '🌲', label: 'Nature' },
      { emoji: '🏚', label: 'Historic Ruins' },
      { emoji: '🥾', label: 'Hiking' },
    ],
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Panorama_at_Land%27s_End_San_Francisco.jpg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Lands_End_Lookout_pano.jpg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Lands_End_Labyrinthe.jpg?width=640',
    ],
    localContext: {
      text: "Lands End sits in the Outer Richmond, one of SF\'s most underrated neighborhoods -- foggy, residential, packed with dim sum and Vietnamese spots. The trail itself feels genuinely wild, nothing like a city park. Sutro Baths ruins are eerie and spectacular at sunset when ocean waves surge through the concrete pools.",
      stats: [
        { label: 'Neighborhood', value: 'Outer Richmond' },
        { label: 'Ships wrecked', value: '10+ on these rocks' },
        { label: 'Nearest food', value: 'Clement Street (1 mi east)' },
        { label: 'Managed by', value: 'Golden Gate NRA' },
      ],
    },
    nearby: [
      { name: 'Sutro Baths Ruins', distance: '0.2 mi', whyVisit: 'Haunting 1896 oceanfront swimming palace ruins -- free to explore, dramatic at high tide when waves surge through the pools.', category: 'culture' },
      { name: 'Cliff House Overlook', distance: '0.3 mi', whyVisit: 'The old restaurant closed but the cliffside lookout platform still delivers one of the city\'s best ocean views.', category: 'nature' },
      { name: 'Clement Street', distance: '1.2 mi', whyVisit: "Inner Richmond\'s main drag -- Green Apple Books, fantastic Cantonese restaurants, and a local neighborhood feel tourists rarely find.", category: 'food' },
    ],
    subPOIs: [
      {
        id: 'sutro-baths',
        name: 'Sutro Baths Ruins',
        description: "Eerie concrete ruins of the world\'s largest indoor swimming complex, now flooded by the Pacific at high tide.",
        lat: 37.7792,
        lng: -122.5133,
        view: { lat: 37.7792, lng: -122.5133, height: 180, heading: 200, pitch: -35 },
      },
      {
        id: 'lands-end-labyrinth',
        name: "Eagle\'s Point Labyrinth",
        description: 'A hand-built stone labyrinth perched on a cliff above the crashing surf with a full Golden Gate view.',
        lat: 37.7830,
        lng: -122.5090,
        view: { lat: 37.7830, lng: -122.5090, height: 120, heading: 140, pitch: -30 },
      },
      {
        id: 'lands-end-coastal-trail',
        name: 'Coastal Trail Overlook',
        description: 'The classic cypress-lined stretch of trail with the Golden Gate perfectly framed through the trees.',
        lat: 37.7815,
        lng: -122.5070,
        view: { lat: 37.7815, lng: -122.5070, height: 200, heading: 130, pitch: -25 },
      },
    ],
    view: defaultView(37.7804, -122.5057, 130),
  },
  {
    id: 'golden-gate-park',
    name: 'Golden Gate Park',
    category: 'nature',
    lat: 37.7694,
    lng: -122.4862,
    blurb:
      'A thousand acres of gardens, lakes, bison, and museums stretching to the ocean -- bigger than Central Park.',
    facts: ['1,017 acres', 'Opened 1871', 'Bison paddock + museums'],
    tags: [
      { emoji: '🌲', label: 'Nature' },
      { emoji: '🎨', label: 'Culture' },
      { emoji: '🚶', label: 'Walkable' },
      { emoji: '🏔', label: 'Scenic' },
    ],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/California-06241_-_In_front_of_museum_%2820449897948%29.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/10%2C_Hippie_Hill.jpg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/California_Academy_of_Sciences_%28TK2%29.JPG?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Conservatory_of_Flowers_-_panoramio_-_harley_photo.jpg?width=640',
    ],
    history:
      'Begun in 1871 on barren sand dunes, Golden Gate Park was an act of sheer will -- gardener John McLaren spent 56 years turning windswept dunes into a thousand acres of greenery. At 1,017 acres it\'s 20% larger than NYC\'s Central Park.',
    whyVisit: [
      'See the de Young Museum and California Academy of Sciences',
      'Visit the bison paddock and Japanese Tea Garden',
      'Bike car-free JFK Drive on weekends to the ocean',
    ],
    stats: [
      { label: 'Size', value: '1,017 acres' },
      { label: 'Opened', value: '1871' },
      { label: 'Visitors', value: '~24 million/year' },
      { label: 'Tree species', value: 'Over 5,000' },
      { label: 'Bison herd', value: 'Since 1891' },
    ],
    gettingThere: 'Muni 5, 7, 28, or N-Judah line along the edges.',
    bestTime: 'Weekend mornings, when JFK Drive is closed to cars.',
    localTip: 'The free botanical garden and the bison are the most underrated stops.',
    localContext: {
      text: 'Golden Gate Park is flanked by Inner Richmond to the north and Inner Sunset to the south -- two of SF\'s most livable, least-touristy neighborhoods. The park runs from urban streets all the way to the open Pacific at Ocean Beach, making it one of the few city parks in the world that touches an ocean.',
      stats: [
        { label: 'North neighbor', value: 'Inner Richmond (dim sum, Irish bars)' },
        { label: 'South neighbor', value: 'Inner Sunset (ramen, surf culture)' },
        { label: 'West end', value: 'Ocean Beach (Pacific Ocean)' },
        { label: 'Length', value: '3.1 miles east to west' },
      ],
    },
    nearby: [
      { name: 'de Young Museum', distance: '0.1 mi', whyVisit: 'SF\'s main fine arts museum -- the copper tower has a free observation floor with city panoramas that rival Twin Peaks.', category: 'culture' },
      { name: 'Irving Street', distance: '0.4 mi (south)', whyVisit: 'Inner Sunset\'s main drag -- Tatami for ramen, Arizmendi for sourdough pizza, Java Beach for coffee before Ocean Beach.', category: 'food' },
      { name: 'Ocean Beach', distance: '1.5 mi (west)', whyVisit: 'A 3.5-mile wild, windswept urban beach -- surfers brave the cold water and bonfires are legal at the south end. Vastly underrated.', category: 'nature' },
    ],
    view: defaultView(37.7694, -122.4862, 90),
  },
  {
    id: 'oracle-park',
    name: 'Oracle Park',
    category: 'attraction',
    lat: 37.7786,
    lng: -122.3893,
    blurb:
      'The Giants\' waterfront ballpark, where home runs splash into McCovey Cove and kayakers wait with nets.',
    facts: ['Opened 2000', 'SF Giants', 'McCovey Cove splash hits'],
    tags: [
      { emoji: '🎭', label: 'Entertainment' },
      { emoji: '🌊', label: 'Waterfront' },
      { emoji: '🏛', label: 'Landmark' },
    ],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Oracle_Park_2021.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/AT%26T_Park%2C_San_Francisco_at_night.jpg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Athletics_vs_San_Francisco_Giants_2025.jpg?width=640',
      'https://commons.wikimedia.org/wiki/Special:FilePath/AT%26T_Park_-_Coke_bottle_and_glove.jpg?width=640',
    ],
    history:
      'Opened in 2000 as the Giants\' first privately financed ballpark in decades, it sits right on the bay. Its short right-field wall drops straight into the water, creating "McCovey Cove," where kayakers wait to fish out home-run balls.',
    whyVisit: [
      'Catch a Giants game with bay views',
      'Walk the free public promenade behind right field',
      'Watch kayakers chase "splash hits" into the cove',
    ],
    stats: [
      { label: 'Opened', value: '2000' },
      { label: 'Capacity', value: '~41,300' },
      { label: 'Splash hits', value: '100+' },
      { label: 'Cost', value: '$357M (privately financed)' },
    ],
    gettingThere: 'Muni N-Judah and T-Third stop right outside; walkable from downtown.',
    bestTime: 'A day game so you can see the bay; arrive early for the promenade.',
    localTip: 'You can watch a few innings free from the right-field archways.',
    localContext: {
      text: 'Oracle Park anchors China Basin, at the northern edge of Mission Bay -- SF\'s newest neighborhood built on former rail yards. What was industrial 25 years ago is now UCSF\'s medical campus and Chase Center (Warriors arena). The bay views from here are among the best in the city.',
      stats: [
        { label: 'Neighborhood', value: 'China Basin / Mission Bay' },
        { label: 'Bay view', value: 'McCovey Cove to the east' },
        { label: 'Nearby', value: 'Chase Center 0.5 mi, UCSF 0.4 mi' },
      ],
    },
    nearby: [
      { name: 'McCovey Cove', distance: '0 mi (right field)', whyVisit: 'The bay inlet where splash hit homers land -- kayak it yourself on off days, or watch the chaos during games.', category: 'nature' },
      { name: 'The Bird (Mission Bay)', distance: '0.5 mi', whyVisit: 'Best fried chicken sandwich in SF, full stop -- chef Evan Rich\'s casual spot. Tiny, packed, worth every minute of the wait.', category: 'food' },
      { name: 'Chase Center', distance: '0.5 mi', whyVisit: 'Home of the Warriors -- even if there\'s no game, the plaza has great public art and a view of the bay that\'s hard to beat.', category: 'attraction' },
    ],
    view: defaultView(37.7786, -122.3893, 220),
  },
  {
    id: 'castro-district',
    name: 'The Castro',
    category: 'nightlife',
    lat: 37.7609,
    lng: -122.435,
    blurb:
      'The heart of LGBTQ+ San Francisco -- rainbow crosswalks, the historic Castro Theatre, and bars that spill onto the sidewalks after dark.',
    facts: ['Rainbow crosswalks', 'Castro Theatre (1922)', 'Lively nightlife'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Castro%2C_San_Francisco%2C_CA.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Entering_the_Castro_district%2C_San_Francisco_%2831984322697%29.jpg?width=640',
    ],
    view: defaultView(37.7609, -122.435, 90),
  },
  {
    id: 'north-beach',
    name: 'North Beach',
    category: 'nightlife',
    lat: 37.7999,
    lng: -122.4097,
    blurb:
      'SF\'s "Little Italy" and old Beat-poet haunt -- espresso bars by day, lively trattorias and neon-lit bars on Broadway by night.',
    facts: ['Little Italy', 'Beat Generation home', 'Broadway bar strip'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/North_Beach%2C_San_Francisco.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/SF_Filbert_St_North_Beach_CA.jpg?width=640',
    ],
    view: defaultView(37.7999, -122.4097, 180),
  },
  {
    id: 'mission-nightlife',
    name: 'Mission District',
    category: 'nightlife',
    lat: 37.7599,
    lng: -122.4148,
    blurb:
      'The city\'s most electric nightlife: muraled alleys, taquerias open late, craft-cocktail dens, and dive bars along Valencia and Mission Streets.',
    facts: ['Murals + nightlife', 'Valencia St bars', 'Best late-night tacos'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Mission_High_School_%28cropped%29.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Balmy_Alley.jpg?width=640',
    ],
    view: defaultView(37.7599, -122.4148, 90),
  },

  // --- North Bay ---
  {
    id: 'sausalito',
    name: 'Sausalito',
    category: 'nature',
    lat: 37.8591,
    lng: -122.4853,
    blurb:
      'A breezy harbor town just across the bridge -- houseboats, art galleries, and a Mediterranean feel looking back at the city.',
    facts: ['Across the bridge', 'Famous houseboats', 'Ferry from SF'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Sausalito.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Gabrielson_Park.jpg?width=640',
    ],
    view: defaultView(37.8591, -122.4853, 160),
  },
  {
    id: 'muir-woods',
    name: 'Muir Woods',
    category: 'nature',
    lat: 37.8959,
    lng: -122.5808,
    blurb:
      'A hushed grove of old-growth coast redwoods just north of the city -- some over 250 feet tall and a thousand years old.',
    facts: ['Old-growth redwoods', 'Up to 258 ft tall', 'Nat\'l Monument 1908'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Muir_Woods_National_Monument_%2847879029461%29.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/MUWO4193.JPG?width=640',
    ],
    view: defaultView(37.8959, -122.5808, 0),
  },

  // --- Peninsula (Caltrain corridor) ---
  {
    id: 'sf-caltrain',
    name: 'San Francisco Station',
    category: 'attraction',
    lat: 37.7765,
    lng: -122.3947,
    blurb:
      'The northern terminus of Caltrain at 4th & King -- where the Peninsula commute begins. All aboard southbound.',
    facts: ['4th & King', 'Caltrain terminus', 'Northern end of the line'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/4th_and_King_Station.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/San_Francisco_4th_and_King_Street_Station.jpg?width=640',
    ],
    view: defaultView(37.7765, -122.3947, 180),
  },
  {
    id: 'millbrae',
    name: 'Millbrae',
    category: 'attraction',
    lat: 37.6,
    lng: -122.3869,
    blurb:
      'A key transfer point where Caltrain meets BART and SFO is a stop away -- gateway between the city and the airport.',
    facts: ['Caltrain + BART', 'Near SFO', 'Major transfer hub'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Millbrae_California.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/SF_From_Marin_Highlands3.jpg?width=640',
    ],
    view: defaultView(37.6, -122.3869, 180),
  },
  {
    id: 'burlingame',
    name: 'Burlingame',
    category: 'shopping',
    lat: 37.5793,
    lng: -122.345,
    blurb:
      'A leafy downtown of cafes and boutiques along Burlingame Avenue, with the bay shoreline trail just to the east.',
    facts: ['Burlingame Ave', 'Tree-lined downtown', 'Bayfront trail'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/BBB2.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Burlingame_Library.JPG?width=640',
    ],
    view: defaultView(37.5793, -122.345, 180),
  },
  {
    id: 'san-mateo',
    name: 'San Mateo',
    category: 'nature',
    lat: 37.5685,
    lng: -122.3239,
    blurb:
      'The Peninsula\'s busy midpoint -- a walkable downtown, Central Park\'s Japanese garden, and great mixed food.',
    facts: ['Central Park garden', 'Walkable downtown', 'Peninsula midpoint'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/MCB-san-mateo-aerial_%28cropped%29.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Central_Park_San_Mateo_CA.jpg?width=640',
    ],
    view: defaultView(37.5685, -122.3239, 180),
  },
  {
    id: 'redwood-city',
    name: 'Redwood City',
    category: 'food',
    lat: 37.4855,
    lng: -122.2319,
    blurb:
      'Once a sleepy port, now a buzzing downtown of restaurants, a movie plaza, and the slogan "Climate Best by Government Test."',
    facts: ['Lively dining plaza', 'Deep-water port', 'Sunny microclimate'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Redwoodcitypanorama.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/City_Hall_Redwood_City_May_2011.jpg?width=640',
    ],
    view: defaultView(37.4855, -122.2319, 180),
  },
  {
    id: 'menlo-park',
    name: 'Menlo Park',
    category: 'culture',
    lat: 37.4548,
    lng: -122.1825,
    blurb:
      'A quiet, affluent town that\'s home to Meta\'s campus and the birthplace ground of much of Silicon Valley venture capital.',
    facts: ['Meta HQ nearby', 'Sand Hill Road VCs', 'Tree-lined streets'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Downtown_Menlo_Park_California.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Hoover_Tower_Stanford_January_2013.jpg?width=640',
    ],
    view: defaultView(37.4548, -122.1825, 180),
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    category: 'culture',
    lat: 37.4275,
    lng: -122.1697,
    blurb:
      'Sandstone arcades, palm-lined drives, and the Hoover Tower -- a campus that feels like a small sunlit city of its own.',
    facts: ['Founded 1885', '8,180 acres', 'Hoover Tower landmark'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/MCB-san-mateo-aerial_%28cropped%29.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/4th_and_King_Station.jpg?width=640',
    ],
    view: defaultView(37.4275, -122.1697, 0),
  },
  {
    id: 'palo-alto-downtown',
    name: 'Downtown Palo Alto',
    category: 'shopping',
    lat: 37.4441,
    lng: -122.1607,
    blurb:
      'University Avenue\'s leafy strip of cafes and bookshops -- the unofficial main street of Silicon Valley.',
    facts: ['University Ave', 'Next to Stanford', 'Startup birthplace'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Palo_Alto_Baylands_January_2013_004_edit.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Caltrain_bikes_palo_alto.jpg?width=640',
    ],
    view: defaultView(37.4441, -122.1607, 90),
  },
  {
    id: 'mountain-view-castro',
    name: 'Castro Street, Mountain View',
    category: 'food',
    lat: 37.3939,
    lng: -122.0797,
    blurb:
      'A walkable downtown packed with food from every corner of the world -- the South Bay\'s best casual eating in one stretch.',
    facts: ['Global food street', 'Walkable downtown', 'Googleplex nearby'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Castro_Street_Mountain_View_sidewalk.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Caltrain_at_Mountain_View.jpg?width=640',
    ],
    view: defaultView(37.3939, -122.0797, 0),
  },
  {
    id: 'san-jose-diridon',
    name: 'San Jose (Diridon)',
    category: 'attraction',
    lat: 37.3297,
    lng: -121.9028,
    blurb:
      'The southern end of the line -- a historic 1935 station and the gateway to downtown San Jose, the valley\'s biggest city.',
    facts: ['Built 1935', 'Southern terminus', 'Gateway to San Jose'],
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/San_Jose_Diridon_Station.jpg?width=640',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/ACE_Bombardier_BiLevel_IX_cab_car_at_San_Jose_Diridon.jpg?width=640',
    ],
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
        'Take to the sky for a scenic flight over the Bay\'s greatest hits -- soar past the Golden Gate, bank over the city, and glide along the coast.',
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
          flyingOver: 'the Marin Headlands',
          areaInfo: {
            name: 'Golden Gate / Presidio',
            population: '~15,000 (Presidio)',
            climate: 'Foggy & windy year-round -- summer coldest month',
            character: 'National park meets military heritage. Forested trails, dramatic ocean cliffs, and the iconic bridge.',
            famousFor: ['Golden Gate Bridge', 'Presidio National Park', 'Baker Beach', 'Crissy Field'],
          },
          narration: [
            "Welcome aboard your aerial tour of the Bay! We\'re lifting off right over the Golden Gate Bridge -- the Bay\'s front door.",
            'Below us, fog often pours through the strait like a slow-motion waterfall. From up here you can see why this is the most photographed bridge on earth.',
          ],
          tip: 'The Marin side (north) has the classic postcard viewpoint.',
          funFact:
            "The bridge isn\'t gold -- it\'s \"International Orange,\" chosen so ships could see it in the Bay\'s thick fog.",
        },
        {
          placeId: 'pier-39',
          flyingOver: 'Fisherman\'s Wharf',
          areaInfo: {
            name: "Fisherman\'s Wharf",
            population: '~3,500 residents',
            industries: ['Tourism', 'Seafood', 'Hospitality'],
            climate: 'Mild and foggy, warmer than the ocean side',
            character: 'SF\'s most visited neighborhood -- touristy but genuinely historic, smells of dungeness crab and salt water.',
            famousFor: ['Pier 39 Sea Lions', 'Alcatraz ferries', 'Dungeness crab', 'Cable cars'],
          },
          narration: [
            "Banking east along the northern waterfront -- that\'s Fisherman\'s Wharf and Pier 39 below.",
            "Hear the barking? A colony of sea lions took over these docks in 1989 and never left. The whole shoreline here is seafood, sailboats, and salt air.",
          ],
          tip: 'Boats to Alcatraz leave from Pier 33, just east of here.',
          funFact:
            'The Pier 39 sea lions showed up right after the 1989 earthquake -- no one knows exactly why they chose this spot.',
        },
        {
          placeId: 'ferry-building',
          flyingOver: 'the Embarcadero',
          areaInfo: {
            name: 'The Embarcadero / Downtown',
            population: '~40,000 (Financial District)',
            medianIncome: '$145,000+',
            industries: ['Finance', 'Tech', 'Legal', 'Hospitality'],
            climate: 'Relatively sunny -- shielded from coastal fog by city hills',
            character: "SF\'s downtown waterfront -- power lunches, historic piers, and the bay always visible at the end of every street.",
            famousFor: ['Ferry Building Marketplace', 'Bay Bridge', 'Transamerica Pyramid', 'Saturday Farmers Market'],
          },
          narration: [
            "Gliding over the Embarcadero now. That clock tower is the Ferry Building, the city\'s grand old front porch on the water.",
            "Once the second-busiest transit terminal in the world, today it\'s a temple to Bay Area food -- and the bay laps right at its feet.",
          ],
          tip: 'Time your visit for the Saturday farmers market.',
          funFact:
            'Its 245-foot clock tower survived both the 1906 and 1989 earthquakes with the clock still keeping time.',
        },
        {
          placeId: 'oracle-park',
          flyingOver: 'SoMa / Mission Bay',
          areaInfo: {
            name: 'Mission Bay / SoMa',
            population: '~12,000',
            medianIncome: '$135,000',
            industries: ['Biotech', 'Tech', 'Healthcare', 'Sports & Entertainment'],
            climate: 'Mild -- slightly warmer than north SF',
            character: 'A brand-new neighborhood built on former rail yards -- gleaming biotech campuses, UCSF hospital, and Oracle Park on the water.',
            famousFor: ['Oracle Park (Giants)', 'UCSF Medical Center', 'Chase Center nearby', 'McCovey Cove'],
          },
          narration: [
            "Curving south to the water\'s edge -- there\'s Oracle Park, home of the Giants.",
            'Right field opens onto the bay, so a big home run splashes into "McCovey Cove," where kayakers paddle around waiting to scoop up the ball.',
          ],
          tip: 'Even non-fans love the bayfront promenade behind right field.',
          funFact:
            'Over 100 "splash hit" home runs have landed in the cove since the park opened in 2000.',
        },
        {
          placeId: 'painted-ladies',
          flyingOver: 'the Western Addition',
          areaInfo: {
            name: 'Alamo Square / Western Addition',
            population: '~30,000',
            medianIncome: '$95,000',
            industries: ['Healthcare', 'Education', 'Creative Services'],
            climate: 'Sheltered -- warmer and sunnier than coastal neighborhoods',
            character: 'Victorian houses, Japantown blocks away, African-American cultural history, and Alamo Square park as the neighborhood living room.',
            famousFor: ['Painted Ladies', 'Alamo Square Park', 'Japantown', 'Full House filming location'],
          },
          narration: [
            "Heading inland over the rooftops -- and there\'s the row of pastel Victorians known as the Painted Ladies.",
            'With the downtown skyline rising behind them, this is the most painted, filmed, and postcarded block in the whole city.',
          ],
          tip: 'Alamo Square park, right in front, is the spot for the photo.',
          funFact:
            'About 48,000 ornate Victorians were built in SF before 1915 -- many were lost in 1906, making the survivors precious.',
        },
        {
          placeId: 'twin-peaks',
          flyingOver: 'the Castro and Noe Valley',
          areaInfo: {
            name: 'Twin Peaks / Castro',
            population: '~25,000',
            medianIncome: '$115,000',
            industries: ['Healthcare', 'Creative', 'Retail', 'LGBTQ+ Community'],
            climate: 'Very windy and cold at the summit; warmer in the Castro below',
            character: "The Castro is SF\'s historic LGBTQ+ neighborhood -- rainbow flags, Victorian Painted Ladies, excellent restaurants. Twin Peaks above is undeveloped city wilderness.",
            famousFor: ['Twin Peaks summit views', 'Castro District', 'Harvey Milk plaza', 'Sutro Tower'],
          },
          narration: [
            "Climbing now to the city\'s rooftop -- Twin Peaks, nearly dead center in San Francisco.",
            "On a clear day you can see the whole Bay from up here: both bridges, the ocean, the East Bay hills. It\'s the best 360 deg view in town.",
          ],
          tip: "Go at sunset -- but bring a jacket, it\'s windy and cool.",
          funFact:
            'The Spanish called these hills "Los Pechos de la Chola." They\'re among the few SF summits left undeveloped.',
        },
        {
          placeId: 'golden-gate-park',
          flyingOver: 'the Inner Sunset',
          areaInfo: {
            name: 'Inner Sunset / Outer Sunset',
            population: '~75,000',
            medianIncome: '$105,000',
            industries: ['Healthcare (UCSF)', 'Retail', 'Restaurants'],
            climate: 'Consistently foggy -- Karl the Fog comes from the ocean daily',
            character: "SF\'s most livable fog belt -- a real neighborhood with amazing ramen, Vietnamese food, surf culture, and UCSF\'s medical campus.",
            famousFor: ['Golden Gate Park', 'Irving Street restaurants', 'Ocean Beach', 'UCSF Parnassus'],
          },
          narration: [
            "Soaring west over a vast green rectangle -- that\'s Golden Gate Park, bigger than New York\'s Central Park.",
            'Built on what were once windswept sand dunes, it now holds museums, lakes, a bison paddock, and gardens, running all the way to the ocean.',
          ],
          tip: "It\'s car-free on JFK Drive on weekends -- rent a bike.",
          funFact:
            'A herd of bison has lived in the park since 1891 -- you can still see them grazing today.',
        },
        {
          placeId: 'lands-end',
          flyingOver: 'the Outer Richmond',
          areaInfo: {
            name: 'Outer Richmond / Lands End',
            population: '~50,000',
            medianIncome: '$95,000',
            industries: ['Retail', 'Restaurants', 'Tourism'],
            climate: 'Coldest and foggiest in the city -- but beautiful in clear weather',
            character: "SF\'s edge -- wild coastal trails, incredible dim sum on Clement Street, and the feeling you\'ve left the city entirely at Lands End.",
            famousFor: ['Lands End Coastal Trail', 'Sutro Baths', 'Clement Street food', 'Ocean Beach'],
          },
          narration: [
            "Our final approach, out to the wild western edge -- Lands End, where the city meets the open Pacific.",
            'Cypress-lined trails, shipwreck-strewn surf, and surprise views of the bridge. A fitting place to bring our flight in to land. Thanks for flying the Bay!',
          ],
          tip: 'The Lands End Labyrinth overlook is a hidden gem.',
          funFact:
            'The rocks below have wrecked dozens of ships -- at very low tide you can still spot rusting hulls.',
        },
      ],
    },
  ],
  // All districts share one cohesive ink color (set in the renderer) for a
  // clean, seamless look — no per-district funky colors.
  districts: [
    {
      id: 'downtown-fidi',
      name: 'Financial District',
      lat: 37.7935,
      lng: -122.3995,
      blurb:
        'The city’s business core — skyscrapers, the Transamerica Pyramid, and Salesforce Tower piercing the skyline.',
      color: '#2F2A24',
      facts: ['Tallest skyline', 'Transamerica Pyramid', 'Salesforce Tower'],
      view: { lat: 37.7935, lng: -122.3995, height: 1400, heading: 30, pitch: -35 },
    },
    {
      id: 'north-beach-area',
      name: 'North Beach',
      lat: 37.8003,
      lng: -122.4103,
      blurb:
        'SF’s Little Italy — espresso bars, Beat-era bookstores, and lively nightlife under Coit Tower.',
      color: '#2F2A24',
      facts: ['Little Italy', 'Beat Generation', 'Nightlife'],
      view: { lat: 37.8003, lng: -122.4103, height: 1200, heading: 0, pitch: -35 },
    },
    {
      id: 'chinatown-area',
      name: 'Chinatown',
      lat: 37.7941,
      lng: -122.4078,
      blurb:
        'The oldest Chinatown in North America — the Dragon Gate, dim sum, herbal shops, and lantern-strung alleys.',
      color: '#2F2A24',
      facts: ['Oldest in N. America', 'Dim sum', 'Dragon Gate'],
      view: { lat: 37.7941, lng: -122.4078, height: 1100, heading: 0, pitch: -35 },
    },
    {
      id: 'fishermans-wharf',
      name: 'Fisherman’s Wharf',
      lat: 37.808,
      lng: -122.4177,
      blurb:
        'The classic tourist waterfront — sea lions, clam chowder, Pier 39, and boats to Alcatraz.',
      color: '#2F2A24',
      facts: ['Sea lions', 'Seafood', 'Alcatraz ferries'],
      view: { lat: 37.808, lng: -122.4177, height: 1300, heading: 180, pitch: -35 },
    },
    {
      id: 'the-mission',
      name: 'The Mission',
      lat: 37.7599,
      lng: -122.4148,
      blurb:
        'The vibrant, muraled heart of Latino SF — taquerías, dive bars, Dolores Park, and the city’s best sun.',
      color: '#2F2A24',
      facts: ['Murals + taquerías', 'Sunniest spot', 'Nightlife'],
      view: { lat: 37.7599, lng: -122.4148, height: 1500, heading: 20, pitch: -35 },
    },
    {
      id: 'castro-area',
      name: 'The Castro',
      lat: 37.7609,
      lng: -122.435,
      blurb:
        'The historic heart of LGBTQ+ San Francisco — rainbow crosswalks, the Castro Theatre, and a buzzing scene.',
      color: '#2F2A24',
      facts: ['LGBTQ+ heart', 'Castro Theatre', 'Nightlife'],
      view: { lat: 37.7609, lng: -122.435, height: 1200, heading: 0, pitch: -35 },
    },
    {
      id: 'haight-ashbury',
      name: 'Haight-Ashbury',
      lat: 37.77,
      lng: -122.4469,
      blurb:
        'The birthplace of 1960s counterculture — Victorian homes, vintage shops, and the gateway to Golden Gate Park.',
      color: '#2F2A24',
      facts: ['Summer of Love', 'Vintage shops', 'Victorians'],
      view: { lat: 37.77, lng: -122.4469, height: 1300, heading: 90, pitch: -35 },
    },
    {
      id: 'hayes-valley',
      name: 'Hayes Valley',
      lat: 37.7765,
      lng: -122.4244,
      blurb:
        'A chic, walkable enclave of boutiques, design shops, and buzzy restaurants around a central green.',
      color: '#2F2A24',
      facts: ['Boutiques', 'Foodie scene', 'Patricia’s Green'],
      view: { lat: 37.7765, lng: -122.4244, height: 1100, heading: 0, pitch: -35 },
    },
    {
      id: 'soma',
      name: 'SoMa',
      lat: 37.7785,
      lng: -122.4056,
      blurb:
        'South of Market — tech HQs, museums (SFMOMA), Oracle Park, and the city’s biggest nightclubs.',
      color: '#2F2A24',
      facts: ['Tech HQs', 'SFMOMA', 'Oracle Park'],
      view: { lat: 37.7785, lng: -122.4056, height: 1500, heading: 30, pitch: -35 },
    },
    {
      id: 'nob-hill',
      name: 'Nob Hill',
      lat: 37.7929,
      lng: -122.4161,
      blurb:
        'Old-money elegance atop the hills — grand hotels, Grace Cathedral, and cable cars clanging up the slopes.',
      color: '#2F2A24',
      facts: ['Grand hotels', 'Grace Cathedral', 'Cable cars'],
      view: { lat: 37.7929, lng: -122.4161, height: 1200, heading: 0, pitch: -35 },
    },
    {
      id: 'pacific-heights',
      name: 'Pacific Heights',
      lat: 37.7925,
      lng: -122.4382,
      blurb:
        'The city’s most prestigious address — mansions, bay views, and the boutiques of Fillmore Street.',
      color: '#2F2A24',
      facts: ['Mansions', 'Bay views', 'Fillmore St'],
      view: { lat: 37.7925, lng: -122.4382, height: 1300, heading: 0, pitch: -35 },
    },
    {
      id: 'sunset-richmond',
      name: 'The Sunset',
      lat: 37.7535,
      lng: -122.4905,
      blurb:
        'Foggy, residential, and right by the ocean — a quiet grid of homes stretching to Ocean Beach.',
      color: '#2F2A24',
      facts: ['Ocean Beach', 'Foggy + quiet', 'Residential'],
      view: { lat: 37.7535, lng: -122.4905, height: 1600, heading: 70, pitch: -35 },
    },

    // ── Peninsula & South Bay ──
    {
      id: 'south-sf',
      name: 'South San Francisco',
      lat: 37.6547,
      lng: -122.4077,
      blurb:
        '“The Industrial City” turned biotech capital of the world — home to Genentech and hundreds of life-science labs.',
      color: '#2F2A24',
      facts: ['Biotech hub', 'Genentech', 'Near SFO'],
      view: { lat: 37.6547, lng: -122.4077, height: 2200, heading: 20, pitch: -35 },
    },
    {
      id: 'daly-city',
      name: 'Daly City',
      lat: 37.6879,
      lng: -122.4702,
      blurb:
        'The foggy gateway just south of the city line — coastal bluffs, a huge Filipino community, and endless rows of homes.',
      color: '#2F2A24',
      facts: ['“Fog City”', 'Coastal bluffs', 'Filipino hub'],
      view: { lat: 37.6879, lng: -122.4702, height: 2200, heading: 60, pitch: -35 },
    },
    {
      id: 'san-mateo-area',
      name: 'San Mateo',
      lat: 37.5629,
      lng: -122.3255,
      blurb:
        'The Peninsula’s lively midpoint — a walkable downtown, Central Park’s Japanese garden, and great mixed food.',
      color: '#2F2A24',
      facts: ['Walkable downtown', 'Japanese garden', 'Midpoint'],
      view: { lat: 37.5629, lng: -122.3255, height: 2200, heading: 0, pitch: -35 },
    },
    {
      id: 'palo-alto-area',
      name: 'Palo Alto',
      lat: 37.4419,
      lng: -122.143,
      blurb:
        'Home of Stanford and the birthplace of Silicon Valley — leafy streets, University Ave, and endless startups.',
      color: '#2F2A24',
      facts: ['Stanford', 'Silicon Valley', 'University Ave'],
      view: { lat: 37.4419, lng: -122.143, height: 2400, heading: 30, pitch: -35 },
    },
    {
      id: 'mountain-view-area',
      name: 'Mountain View',
      lat: 37.3861,
      lng: -122.0839,
      blurb:
        'Googleplex country — a global food street on Castro, the Computer History Museum, and bayfront tech campuses.',
      color: '#2F2A24',
      facts: ['Googleplex', 'Castro St food', 'Computer History Museum'],
      view: { lat: 37.3861, lng: -122.0839, height: 2400, heading: 20, pitch: -35 },
    },
    {
      id: 'san-jose-area',
      name: 'San Jose',
      lat: 37.3382,
      lng: -121.8863,
      blurb:
        'The Bay’s biggest city and the capital of Silicon Valley — a sprawling, sunny downtown anchored by tech.',
      color: '#2F2A24',
      facts: ['Biggest Bay city', 'Silicon Valley capital', 'Sunny'],
      view: { lat: 37.3382, lng: -121.8863, height: 2800, heading: 10, pitch: -35 },
    },
    {
      id: 'cupertino-area',
      name: 'Cupertino',
      lat: 37.323,
      lng: -122.0322,
      blurb:
        'Quiet suburb made famous by Apple Park — the gleaming “spaceship” ring HQ and top-rated schools.',
      color: '#2F2A24',
      facts: ['Apple Park', '“The spaceship”', 'Top schools'],
      view: { lat: 37.323, lng: -122.0322, height: 2400, heading: 0, pitch: -35 },
    },
  ],
}
