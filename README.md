# City Explorer

A simple, 3D, gamified way for someone new to a city to get the lay of the land.
Pick a city, then either **ride a guided tour** (camera on rails) or **explore in 3D**
(free-roam map, click places to learn about them). v1 supports the **Bay Area**.

Built on [CesiumJS](https://cesium.com/) with Google Photorealistic 3D Tiles, the
feeling we're after is *a local friend showing a newcomer around.*

## Run it

```bash
npm install
cp .env.example .env   # then fill in your two keys (see below)
npm run dev            # http://localhost:5173
```

### API keys (both have free tiers)

`.env` needs:

- `VITE_CESIUM_ION_TOKEN` — from https://ion.cesium.com/tokens
- `VITE_GOOGLE_MAPS_KEY` — a Google Maps Platform key with the **Map Tiles API** enabled

Without keys the app shows a friendly "add your keys" panel instead of a broken map.

## How it works

- **Pick a city** → **pick a mode** → the 3D map.
- **Explore:** orbit/pan/zoom; click a pin to fly there and read a blurb.
- **Tour:** camera glides stop-to-stop with narration; advance via buttons,
  scroll, or arrow keys.
- **Passport** (top-right): collects a stamp per discovered place, tracks
  "X of N discovered", and awards badges for quests. Persists in localStorage.

## Adding another city

Everything the UI renders comes from a `City` data object — no city is hardcoded.
To add one:

1. Create `src/data/cities/<city>.ts` exporting a `City` (places, tours, quests,
   an `intro` camera view). Use `src/data/cities/bay-area.ts` as the template.
2. Add it to the registry in `src/data/cities/index.ts`.

That's it — the picker, map, explore, tour, and passport all pick it up.

## Project structure

```
src/
  data/         types.ts + cities/ (all content lives here)
  state/        zustand stores: app screen, passport, quests
  cesium/       viewer hook, camera helpers, pins
  screens/      CityPicker, ModePicker, MapView, ExploreMode, TourMode
  components/   PlacePanel, Passport, BadgeToast, Fog, MissingKeys
```

## Notes

- Place coordinates are approximate and camera framings use sensible defaults —
  tune per place in `bay-area.ts` as desired.
- Restrict your Google Maps key (HTTP referrers + Map Tiles API only) before
  deploying anywhere public.
