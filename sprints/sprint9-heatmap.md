# Sprint 9: Community Heatmap & Map View Toggle

**Assignee:** TBD
**Goal:** Add a toggle to the map that lets users switch between two views: **"My Photos"** (their own photo pins, the default) and **"Community Heatmap"** (a heat overlay showing where all public photos are concentrated, with weekly/monthly/yearly time filters). Build the heatmap components, backend endpoint, and toggle controls.
**Dependencies:** Sprints 1–5 (already merged into main). No dependency on Sprints 7, 8, or 10 — can start immediately.
**Parallel notes:** The heatmap components (`HeatmapLayer`, `MapViewToggle`) are all-new files with zero conflicts. The backend endpoint (`GET /api/photos/heatmap`) is a new function and route — easy merge. **The one merge ordering constraint:** this sprint adds the view toggle to `Map.jsx`, which Sprint 6 also modifies. **Merge Sprint 6 first, then rebase this sprint on top.** You can develop in parallel — just be prepared to rebase onto Sprint 6's version of `Map.jsx` before merging.

---

## Before You Start

**Check the README.md** at the project root for instructions on setting up the dev environment and running the app (both frontend and backend).

### Git Workflow

Your typical workflow once you receive a sprint should be:

1. Start on the `main` branch
2. `git pull` + `npm install` (in both root and `server/`) to make sure you are up to date
3. `git switch -c <your-branch>` — e.g. `yourname/sprint9`
4. Do `git add` & `git commit` while working (frequently + descriptive messages)
5. `git push origin <your-branch>` to push your local branch to GitHub
6. When you are done with your sprint, pull from main once more to resolve any merge conflicts early
7. Create a pull request on GitHub with a descriptive description, and then we can merge it safely!

---

## Background (read this first)

The map view has two modes, controlled by a toggle:

1. **"My Photos"** (default) — shows the user's own photo pins on the map (Sprint 6 builds this). Users can click pins to see their photos, click the map to upload new ones, etc.
2. **"Community Heatmap"** — hides the user's pins and instead shows a heatmap overlay of ALL public photos across the community. Hot zones (red/orange) = lots of photos. Cold zones (blue/transparent) = few or none. Includes time period filters: Past Week | Past Month | Past Year | All Time.

This gives users a clear way to switch between "my stuff" and "what's everyone else doing."

A **heatmap** is a data visualization where areas with more activity appear "hotter" (red/orange) and areas with less activity appear "cooler" (green/blue) or transparent. We use public photo locations as the data points — clusters of photos create hot zones.

**How to develop without other sprints:** You can build and test the `HeatmapLayer` component using hardcoded test points (LA coordinates) before the API is connected. For the backend endpoint, you can create test photos via curl.

**Key concepts:**
- **Leaflet.heat** — a Leaflet plugin that renders heatmap overlays. It takes an array of `[lat, lng, intensity]` points and draws a gradient layer on the map.
- **Intensity** — each point can have a weight. For our use case, each photo = 1 point with equal weight, so the heat comes from density (many photos in one area).
- **Radius and blur** — `leaflet.heat` has `radius` (how wide each point's influence is in pixels) and `blur` (how much the edges fade). Tuning these affects how the heatmap looks.
- **Time filtering** — the community heatmap can be filtered by time period (past week, month, year, all time) to show trends.
- **View toggle** — only one view is active at a time. When the user switches to Community Heatmap, their personal pins are hidden. When they switch back, pins reappear and the heatmap is hidden.

**Useful resources:**
- [leaflet.heat GitHub](https://github.com/Leaflet/Leaflet.heat) — the main plugin docs
- [Leaflet.heat with React Leaflet guide](https://stackoverflow.com/questions/64891918) — search for "react leaflet heatmap layer"
- [Leaflet custom pane docs](https://leafletjs.com/reference.html#map-pane) — for layering the heatmap under/over markers
- Search for "react leaflet heat map tutorial" for integration examples

---

## Tasks

### 1. Install the heatmap plugin

- [ ] Install `leaflet.heat` in the frontend root directory
  > Note: `leaflet.heat` doesn't have TypeScript types or a React wrapper. You'll import it and use it through a custom React Leaflet component. Check npm for the correct package name — it might be `leaflet.heat` or `leaflet-heat`.

### 2. Create a HeatmapLayer component

- [ ] Create `src/components/Map/HeatmapLayer.jsx`
- [ ] This is a custom React Leaflet component that wraps `leaflet.heat`
- [ ] It should:
  - Accept a `points` prop — an array of `[lat, lng, intensity]` tuples
  - Accept optional `radius`, `blur`, `maxZoom`, and `gradient` props for configuration
  - Use React Leaflet's `useMap()` hook to get the map instance
  - Create the heat layer using `L.heatLayer(points, options)` and add it to the map
  - Clean up (remove the layer) when the component unmounts or when points change
  > Use a `useEffect` that creates the layer and returns a cleanup function. Store the layer in a `useRef` so you can remove it later.
- [ ] **Test with hardcoded points first** — use a few LA coordinates to verify the heatmap renders:
  ```js
  const TEST_POINTS = [
    [34.0522, -118.2437, 1],  // DTLA
    [34.0094, -118.4973, 1],  // Santa Monica
    [34.0094, -118.4973, 1],  // Santa Monica (duplicate = hotter)
    [34.1184, -118.3004, 1],  // Griffith
    [34.0689, -118.4452, 1],  // UCLA
  ]
  ```

### 3. Add a backend endpoint for heatmap data

- [ ] Create a new controller function `getHeatmapData` in `server/controllers/photoController.js`:
  - Query photos where `isPublic: true`, returning ONLY `location.lat` and `location.lng` (use `.select('location createdAt')` to minimize payload)
  - Support a `period` query parameter: `week`, `month`, `year`, or `all` (default: `all`)
  - For time filtering, calculate the start date and add it to the query: `createdAt: { $gte: startDate }`
  - Return: `{ points: [[lat, lng], [lat, lng], ...], count: <number> }`
  > Keep the response lean — this endpoint could return thousands of points. Only send coordinates, not full photo objects.

- [ ] Add the route: `GET /api/photos/heatmap` in `server/routes/photoRoutes.js`
  - No authentication required (community data is public)
  - **Important:** define this route BEFORE the `GET /api/photos/:id` route to avoid route conflicts

### 4. Build the map view toggle

- [ ] Create `src/components/Map/MapViewToggle.jsx` and `src/components/Map/MapViewToggle.css`
- [ ] This component is an overlay control on the map (e.g., top-right corner) that lets the user switch between two views:
  - **"My Photos"** — the default. Shows the user's photo pins (click to view, click map to upload).
  - **"Community Heatmap"** — shows the heatmap overlay of all public photos.
- [ ] Use a simple toggle (two buttons, a segmented control, or a switch). Make the active view visually obvious.
- [ ] When "Community Heatmap" is selected, show time period filter buttons below the toggle: **Past Week | Past Month | Past Year | All Time** (default: All Time)
- [ ] Show a photo count label when in heatmap mode (e.g., "247 public photos this month")
- [ ] The component should accept callback props: `onViewChange(view)`, `onPeriodChange(period)`
- [ ] Style it so it floats above the map with a semi-transparent background
- [ ] Make sure it doesn't interfere with map interactions
  > Use CSS `pointer-events: none` on the container and `pointer-events: auto` on the interactive elements inside.

### 5. Integrate the toggle into Map.jsx

- [ ] Add state to `Map.jsx`:
  - `mapView` — either `'my-photos'` (default) or `'community-heatmap'`
  - `heatmapPeriod` — `'all'`, `'week'`, `'month'`, or `'year'` (default: `'all'`)
  - `heatmapPoints` — array of `[lat, lng]` from the API
  - `heatmapCount` — total photo count from the API
- [ ] Render the `MapViewToggle` component inside the `MapContainer`
- [ ] When `mapView === 'my-photos'`:
  - Show the user's photo pins (existing behavior from Sprint 6)
  - Allow map clicks to open the upload modal (existing behavior)
  - Hide the heatmap layer
- [ ] When `mapView === 'community-heatmap'`:
  - Hide the user's photo pins
  - Disable the click-to-upload behavior (don't open the upload modal when the map is clicked)
  - Fetch data from `GET /api/photos/heatmap?period=<period>` and render the `HeatmapLayer`
  - When the user changes the time period, re-fetch and update the heatmap
- [ ] **If Sprint 6 hasn't merged yet:** work with the current `Map.jsx` (hardcoded pins). Add your toggle and heatmap code alongside the existing code. When Sprint 6 merges, you'll rebase — the conflict is manageable (Sprint 6's dynamic pins + your view toggle).

### 6. Write E2E tests

Create `tests/test_sprint9_heatmap.py` following the same pattern as `tests/test_sprint4_photos.py`. Use the shared fixtures from `conftest.py`.

Test the new `GET /api/photos/heatmap` endpoint:

- [ ] `GET /api/photos/heatmap` → 200, returns `{ points: [...], count: <number> }`
- [ ] Each point in `points` is a `[lat, lng]` array (not a full photo object — response should be lean)
- [ ] Only public photos appear in heatmap data (upload a private photo, confirm it's NOT in the response)
- [ ] `?period=week` → only returns photos from the past 7 days
- [ ] `?period=month` → only returns photos from the past 30 days
- [ ] `?period=year` → only returns photos from the past 365 days
- [ ] `?period=all` (or no period param) → returns all public photos
- [ ] Works without auth (no token) → 200 (this is a public endpoint)
- [ ] `count` in the response matches the length of the `points` array
- [ ] Run `pytest -v tests/test_sprint9_heatmap.py` and confirm all tests pass

> **Tip:** to test time filtering, upload a public photo and immediately query with `?period=week` — it should appear (it was just created). Testing that old photos are excluded is harder in E2E tests, so focus on verifying the endpoint returns the right shape and that the period param is accepted without errors.

### 7. Test the full flow manually

- [ ] Default view shows "My Photos" with the user's pins visible
- [ ] Toggle to "Community Heatmap" → pins disappear, heatmap overlay appears
- [ ] Toggle back to "My Photos" → heatmap disappears, pins reappear
- [ ] In heatmap mode, switch time periods → heatmap updates with filtered data
- [ ] In heatmap mode, clicking the map does NOT open the upload modal
- [ ] Zoom in/out → heatmap adjusts appropriately
- [ ] No public photos scenario → heatmap shows nothing (no crash)
- [ ] Performance: map stays responsive with hundreds of heatmap points

---

## Merge Conflict Notes

**Most of this sprint is new files — low conflict.** The one exception:

- `Map.jsx` — Sprint 6 rewrites this file (removes demo pins, adds dynamic fetching + upload modal). **Merge Sprint 6's PR first**, then rebase this branch. The conflict is manageable: Sprint 6 changes how pins are loaded, and this sprint adds the view toggle + heatmap layer. Keep both sets of changes.
- `photoController.js` — adds `getHeatmapData` function. Other sprints also add functions. Just include all in the export.
- `photoRoutes.js` — adds `GET /heatmap` route. Keep all routes; named routes before `/:id`.

## Deliverables Checklist

- [ ] `HeatmapLayer` component wrapping `leaflet.heat`
- [ ] `GET /api/photos/heatmap` endpoint with time period filtering
- [ ] `MapViewToggle` component with "My Photos" / "Community Heatmap" switch
- [ ] Toggle switches between showing personal pins and community heatmap
- [ ] Time period filters (week/month/year/all) visible in heatmap mode
- [ ] Community heatmap shows photo count
- [ ] Click-to-upload disabled in heatmap mode
- [ ] E2E tests pass: `pytest -v tests/test_sprint9_heatmap.py`

## File Structure

```
src/
├── components/
│   └── Map/
│       ├── Map.jsx               (modified — add view toggle state + conditional rendering)
│       ├── HeatmapLayer.jsx      (new)
│       ├── MapViewToggle.jsx     (new)
│       ├── MapViewToggle.css     (new)
│       └── Map.css               (modified)

server/
├── controllers/
│   └── photoController.js        (modified — add getHeatmapData + export)
└── routes/
    └── photoRoutes.js            (modified — add GET /heatmap route)

tests/
└── test_sprint9_heatmap.py       (new)
```
