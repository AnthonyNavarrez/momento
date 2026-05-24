# Sprint 6: Photo Pinning on the Map

**Assignee:** TBD
**Goal:** Connect the photo upload system to the map so users can pin photos to locations and see their uploaded photos as markers on the map.
**Dependencies:** Sprints 1–5 (already merged into main). No dependency on Sprints 7–10 — can start immediately.
**Parallel notes:** This sprint modifies `Map.jsx` and `MapPin.jsx`. Sprint 9 (heatmap) will later add to `Map.jsx`, so **Sprint 9's PR should merge after this one** to avoid conflicts. All other sprints are safe to work on in parallel.

---

## Before You Start

**Check the README.md** at the project root for instructions on setting up the dev environment and running the app (both frontend and backend).

### Git Workflow

Your typical workflow once you receive a sprint should be:

1. Start on the `main` branch
2. `git pull` + `npm install` (in both root and `server/`) to make sure you are up to date
3. `git switch -c <your-branch>` — e.g. `yourname/sprint6`
4. Do `git add` & `git commit` while working (frequently + descriptive messages)
5. `git push origin <your-branch>` to push your local branch to GitHub
6. When you are done with your sprint, pull from main once more to resolve any merge conflicts early
7. Create a pull request on GitHub with a descriptive description, and then we can merge it safely!

---

## Background (read this first)

Right now the map shows hardcoded demo pins, and the photo API exists but nothing on the frontend uses it. This sprint connects the two: users click the map to pick a location, upload a photo there, and see all their photos as interactive pins.

**Key concepts:**
- **Map click events** — we already have a `MapClickLogger` that logs coordinates to the console. We'll replace that with a real upload flow.
- **Multipart form data** — file uploads can't be sent as JSON. We use `FormData` in the browser, which Axios sends as `multipart/form-data` automatically.
- **Dynamic markers** — instead of hardcoded pins, we fetch the user's photos from the API and render a `MapPin` for each one.

**Useful resources:**
- [MDN FormData docs](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Axios file upload guide](https://axios-http.com/docs/multipart) — look at how to send FormData
- [React Leaflet useMapEvents](https://react-leaflet.js.org/docs/api-map/#usemapevents)
- Search for "react leaflet click to add marker" for examples

---

## Tasks

### 1. Lock the map to the Los Angeles area

- [ ] In `Map.jsx`, add bounds to restrict panning to the greater LA area. Use Leaflet's `maxBounds` prop on `MapContainer`:
  ```jsx
  const LA_BOUNDS = [
    [33.7, -118.7],  // southwest corner
    [34.4, -118.0],  // northeast corner
  ]

  <MapContainer
    center={LOS_ANGELES_COORDS}
    zoom={12}
    maxBounds={LA_BOUNDS}
    maxBoundsViscosity={1.0}
    minZoom={10}
  >
  ```
- [ ] Set `maxBoundsViscosity` to `1.0` so the map snaps back hard when the user tries to pan outside the bounds (no elastic dragging)
- [ ] Set `minZoom` to `10` so users can't zoom out far enough to see outside LA
- [ ] Test: try dragging the map past the bounds — it should stop. Try zooming all the way out — LA should still fill the view.
  > This keeps the app focused on Los Angeles. The bounds above cover from roughly Long Beach to Pasadena and from Malibu to East LA. Adjust the coordinates if you want to include a wider or narrower area.

### 2. Create a photo upload form/modal

- [ ] Create `src/components/PhotoUpload.jsx` and `src/components/PhotoUpload.css`
- [ ] Build a simple form/modal that appears when the user clicks a location on the map
- [ ] The form should include:
  - A file input (`<input type="file" accept="image/*">`) for selecting a photo
  - A text input for an optional caption
  - A display of the selected lat/lng (read-only, passed as props)
  - A submit button and a cancel button
- [ ] Track form state with `useState` (selected file, caption)
- [ ] On submit, build a `FormData` object with:
  - `photo` — the selected file
  - `lat` — the latitude
  - `lng` — the longitude
  - `caption` — the caption text
- [ ] POST it to `/api/photos` using the axios instance from `src/api/axios.js`
- [ ] Show a loading state while uploading and an error message if it fails
- [ ] On success, close the modal and notify the parent to refresh the photo list
  > Remember: the axios instance already has the JWT interceptor, so auth is handled automatically.

### 3. Replace the demo pins with real photo data

- [ ] In `src/components/Map/Map.jsx`, remove the hardcoded `DEMO_PINS` array
- [ ] Add a `useEffect` that fetches the user's photos from `GET /api/photos` on mount
- [ ] Store the photos in component state using `useState`
- [ ] Render a `MapPin` for each photo using its `location.lat` and `location.lng`
- [ ] In the popup for each pin, show:
  - The photo thumbnail (use the `imageUrl` field — prepend the backend URL if needed)
  - The caption
  - The date it was uploaded (formatted nicely)
  > The backend serves images at `/uploads/filename.jpg`. With the Vite proxy, you can use this path directly for the `<img>` src.

### 4. Wire up map click → upload flow

- [ ] Modify `MapClickLogger` (or replace it) so that clicking the map:
  - Captures the lat/lng coordinates
  - Stores them in state
  - Opens the PhotoUpload modal with those coordinates
- [ ] After a successful upload, re-fetch the photo list so the new pin appears immediately
- [ ] Add a temporary marker at the clicked location while the upload modal is open, so the user can see where they're pinning
  > You can use React state to conditionally render a marker at the clicked position.

### 5. Add a delete button to photo popups

- [ ] In each photo's popup on the map, add a "Delete" button
- [ ] On click, call `DELETE /api/photos/:id`
- [ ] After successful deletion, remove the photo from the local state (or re-fetch the list)
- [ ] Add a confirmation step (e.g., `window.confirm("Delete this photo?")`) to prevent accidental deletions

### 6. Style the upload modal and popups

- [ ] Style the upload modal so it overlays the map cleanly (centered, semi-transparent backdrop)
- [ ] Style the photo popups to show thumbnails at a reasonable size (e.g., 150px wide)
- [ ] Make sure the map is still usable underneath (clicking the backdrop should close the modal)
- [ ] Style the file input and form buttons to match the app's existing look

### 7. Handle edge cases

- [ ] Show a "No photos yet" message or state if the user has no uploads
- [ ] Handle the case where the photo API request fails (show an error, don't crash)
- [ ] Disable the submit button while an upload is in progress to prevent double-submits
- [ ] If the user is on a slow connection, show upload progress or at minimum a spinner

### 8. Write E2E tests

This sprint is frontend-only (no new API endpoints), but you should still write tests that verify the API behavior your frontend depends on. Create `tests/test_sprint6_map_pinning.py` following the same pattern as `tests/test_sprint4_photos.py`. Use the shared fixtures from `conftest.py` (`base_url`, `auth_header`, etc.).

- [ ] Test the upload → fetch → verify cycle that the map relies on:
  - Upload a photo with lat/lng → 201
  - `GET /api/photos` returns the photo with correct `location.lat` and `location.lng`
  - The `imageUrl` in the response starts with `/uploads/` (the map uses this for thumbnails)
  - Upload multiple photos → `GET /api/photos` returns them sorted by `createdAt` descending (newest first — the map needs this ordering)
- [ ] Test that the image URL is accessible:
  - Upload a photo, get the `imageUrl` from the response
  - `GET` the image URL (e.g., `http://localhost:5001/uploads/...`) → 200 (the map popup loads images from this URL)
- [ ] Run `pytest -v tests/test_sprint6_map_pinning.py` and confirm all tests pass

> **Tip:** look at `tests/test_sprint4_photos.py` for examples of how to use `make_test_image()`, fixtures, and assertions. Your tests should import `requests` and `io`, and use the `base_url` and `auth_header` fixtures from `conftest.py`.

### 9. Test the full flow manually

- [ ] Map is bounded to LA — can't pan to New York or zoom out to see the whole US
- [ ] Click the map → upload modal appears with correct coordinates
- [ ] Select a photo, add a caption, submit → pin appears on the map at the right location
- [ ] Click the pin → popup shows the photo thumbnail, caption, and date
- [ ] Delete a photo from its popup → pin disappears from the map
- [ ] Refresh the page → all pins reload from the API
- [ ] Upload without selecting a file → should show an error, not submit

---

## Merge Conflict Notes

This sprint modifies `Map.jsx` and `MapPin.jsx`. Other sprints create entirely new files and won't conflict. Sprint 9 (heatmap) will later add toggles to `Map.jsx` — that sprint should merge after this one.

## Deliverables Checklist

- [ ] Map is locked to the LA area (can't pan or zoom outside bounds)
- [ ] Clicking the map opens an upload modal with the selected coordinates
- [ ] Photos upload successfully and appear as pins on the map
- [ ] Photo popups show thumbnail, caption, and upload date
- [ ] Delete button removes a photo (with confirmation)
- [ ] No more hardcoded demo pins — all pins come from the API
- [ ] Error states are handled (failed upload, failed fetch, no photos)
- [ ] E2E tests pass: `pytest -v tests/test_sprint6_map_pinning.py`

## File Structure

```
src/
├── components/
│   ├── PhotoUpload.jsx       (new)
│   ├── PhotoUpload.css       (new)
│   └── Map/
│       ├── Map.jsx           (modified — dynamic pins, click-to-upload)
│       ├── MapPin.jsx        (modified — photo popup content)
│       └── Map.css           (modified — popup styles)

tests/
└── test_sprint6_map_pinning.py   (new)
```
