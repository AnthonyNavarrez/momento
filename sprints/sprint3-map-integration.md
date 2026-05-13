# Sprint 3: Frontend Map Integration

**Assignee:** TBD
**Goal:** Set up the interactive map on the frontend using React Leaflet so users can view, pan, and zoom around Los Angeles.
**Dependencies:** None — this is pure frontend work, can start immediately

---

## Background (read this first)

We're using **Leaflet** to display an interactive map. Leaflet is a free, open-source JavaScript library for maps (like a lightweight alternative to Google Maps). **React Leaflet** gives us React components that wrap Leaflet, so we can use JSX like `<MapContainer>` and `<Marker>` instead of writing raw JavaScript DOM code.

**Key concepts:**
- **Tiles** — maps are made up of small square images ("tiles") loaded from a tile server. We use OpenStreetMap tiles, which are free and don't need an API key.
- **Lat/Lng** — latitude and longitude coordinates. Los Angeles is roughly `[34.0522, -118.2437]`.
- **Markers** — pins on the map that indicate a location and can be clicked.
- **Popups** — small info boxes that appear when you click a marker.

**Useful resources:**
- [React Leaflet getting started](https://react-leaflet.js.org/docs/start-introduction/)
- [React Leaflet MapContainer API](https://react-leaflet.js.org/docs/api-map/)
- [Leaflet quick start guide](https://leafletjs.com/examples/quick-start/)
- Search for "react leaflet vite setup" for Vite-specific guidance

---

## Tasks

### 1. Install map dependencies

- [ ] In the `momento/` directory (frontend root), install `react-leaflet` and `leaflet`

### 2. Import Leaflet's CSS

- [ ] In `src/main.jsx`, import Leaflet's stylesheet (`leaflet/dist/leaflet.css`)
  > If you skip this, the map will look broken — tiles will be misaligned and markers won't show up correctly. This is the #1 most common Leaflet setup mistake.

### 3. Fix Leaflet's marker icon issue

Leaflet's default marker icons don't work with bundlers like Vite out of the box. The images can't be found at runtime.

- [ ] Research "leaflet marker icon fix vite" or "leaflet default icon webpack" — this is a well-documented issue
- [ ] The fix involves importing the marker icon images from the leaflet package and manually setting them on `L.Icon.Default`
  > You'll need to import `L` from `leaflet`, import the marker icon and shadow images from `leaflet/dist/images/`, and call `L.Icon.Default.mergeOptions()` with the correct paths.

### 4. Build the Map component

- [ ] Create `src/components/Map/Map.jsx`
- [ ] Use `MapContainer` from react-leaflet to render a map
- [ ] Center it on Los Angeles (lat: `34.0522`, lng: `-118.2437`)
- [ ] Set a default zoom level of around `12` (shows a good chunk of the city)
- [ ] Add a `TileLayer` using OpenStreetMap's free tile URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
  > Look at the React Leaflet docs for `MapContainer` and `TileLayer`. The `{s}`, `{z}`, `{x}`, `{y}` placeholders are handled automatically by Leaflet.
- [ ] Verify the map renders by importing and using it in `App.jsx` temporarily

### 5. Add click-to-log-coordinates

When a user clicks the map, we want to capture those coordinates (this will be used later for pinning photos to locations).

- [ ] Create a small helper component that uses React Leaflet's `useMapEvents` hook
- [ ] Listen for the `click` event and log the latitude and longitude to the browser console
- [ ] Place this component inside your `MapContainer`
  > This component won't render anything visible — it just hooks into map events. Look up `useMapEvents` in the React Leaflet docs.
- [ ] Test: click anywhere on the map and check the browser console for coordinates

### 6. Create a reusable MapPin component

- [ ] Create `src/components/Map/MapPin.jsx`
- [ ] It should accept a `position` prop (an array like `[lat, lng]`) and optional children
- [ ] Render a Leaflet `Marker` at the given position
- [ ] Inside the marker, render a `Popup` that displays the children (or placeholder text if no children provided)
  > Look up `Marker` and `Popup` in the React Leaflet docs.

### 7. Demo with hardcoded pins

- [ ] In your Map component, add 3–5 test pins at known LA locations using your MapPin component:
  - Santa Monica Pier: `[34.0094, -118.4973]`
  - Griffith Observatory: `[34.1184, -118.3004]`
  - UCLA: `[34.0689, -118.4452]`
  - Grand Central Market: `[34.0508, -118.2494]`
- [ ] Verify each pin appears at the right spot on the map
- [ ] Click each pin and confirm the popup opens with the correct label

### 8. Style the map container

- [ ] Create `src/components/Map/Map.css`
- [ ] Make the map fill the full viewport (100% width, 100vh height)
- [ ] Make sure there are no scrollbar or overflow issues
- [ ] Import the CSS file in your Map component

---

## Deliverables Checklist

- [ ] Map renders full-screen, centered on Los Angeles
- [ ] Pan (drag) and zoom (scroll wheel / buttons) work correctly
- [ ] Clicking the map logs lat/lng coordinates to the browser console
- [ ] Reusable `MapPin` component renders markers with clickable popups
- [ ] 4 demo pins visible at known LA locations
- [ ] No visual glitches (broken icons, scroll overflow, misaligned tiles)

## File Structure

```
src/
└── components/
    └── Map/
        ├── Map.jsx
        ├── Map.css
        └── MapPin.jsx
```
