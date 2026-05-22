# Sprint 7: Photo Detail View & Gallery Page

**Assignee:** TBD
**Goal:** Build a gallery page where users can browse all their photos in a grid, and a detail view that shows a full-size photo with its metadata and location on a mini-map. Also add a backend PUT endpoint for editing photo metadata.
**Dependencies:** Sprints 1–5 (already merged into main). No dependency on Sprints 6, 8, 9, or 10 — can start immediately.
**Parallel notes:** You don't need Sprint 6 to be done. You can upload test photos via Postman or curl using the existing `POST /api/photos` endpoint (see Sprint 4). This sprint creates all-new page files and only lightly touches `App.jsx` (adding routes) and `Navbar.jsx` (adding a Gallery link) — easy to merge with other sprints.

---

## Before You Start

Check the `README.md` at the project root for instructions on setting up the dev environment and running the app (both frontend and backend).

## Git Workflow

1. Start on the `main` branch
2. `git pull` + `npm install` (in both root and `server/`) to make sure you are up to date
3. `git switch -c <your-branch>` — e.g. `yourname/sprint7`
4. Do `git add` & `git commit` while working (frequently + descriptive messages)
5. `git push origin <your-branch>` to push your local branch to GitHub
6. When you are done with your sprint, pull from main once more to resolve any merge conflicts early
7. Create a pull request on GitHub with a descriptive description, and then we can merge it safely!

---

## Background (read this first)

Right now the only way to see photos is through the map popup (Sprint 6 will add that, but we don't need to wait for it). We need a proper gallery view where users can scroll through all their photos, and a detail view where they can see a photo full-size with all its info.

**How to test without Sprint 6:** Upload test photos using Postman or curl directly against the API:

```bash
curl -X POST http://localhost:5001/api/photos \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "photo=@/path/to/image.jpg" \
  -F "lat=34.0522" \
  -F "lng=-118.2437" \
  -F "caption=Test photo"
```

**Key concepts:**
- **CSS Grid** — a layout system for creating responsive grids of items. Perfect for photo galleries.
- **Dynamic routing** — React Router lets you define routes with parameters, like `/photos/:id`. The `:id` part becomes a variable you can read in the component.
- **Mini-map** — a small, non-interactive map showing just the photo's pin location. We can reuse the existing map components for this.
- **Image aspect ratios** — photos come in different sizes. Using `object-fit: cover` on `<img>` elements crops them to fit a container while maintaining aspect ratio.

**Useful resources:**
- [CSS Grid guide (CSS-Tricks)](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [React Router useParams](https://reactrouter.com/en/main/hooks/use-params)
- [MDN object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
- Search for "react photo gallery grid responsive" for layout ideas

---

## Tasks

### 1. Add the backend PUT endpoint for updating photos

This is needed for the edit caption feature and will also be used by Sprint 8 (public toggle) and Sprint 10 (tag editing). Do this first so other sprints can use it.

- Add an `updatePhoto` function in `server/controllers/photoController.js`:
  - Find the photo by ID
  - Verify the user owns it (return 403 if not)
  - Update allowed fields only: `caption`, `tags`, `isPublic` — do NOT allow changing the image or location
  - Return the updated photo
- Add the route `PUT /api/photos/:id` in `server/routes/photoRoutes.js` with the `protect` middleware

This adds a new function and a new route line — no conflicts with existing code.

### 2. Create the Gallery page

- Create `src/pages/GalleryPage.jsx` and `src/pages/GalleryPage.css`
- On mount, fetch all of the user's photos from `GET /api/photos`
- Display them in a responsive CSS grid (3 columns on desktop, 2 on tablet, 1 on mobile)
- Each grid item should show:
  - The photo as a square thumbnail (use `object-fit: cover` to crop to square)
  - The caption overlaid at the bottom (semi-transparent background)
  - The upload date
- Make each thumbnail clickable — link to `/photos/:id`
- If the user has no photos, show an empty state message like "No photos yet. Go to the map to start pinning!"
- Add a loading spinner while the photos are being fetched

### 3. Create the Photo Detail page

- Create `src/pages/PhotoDetailPage.jsx` and `src/pages/PhotoDetailPage.css`
- On mount, fetch the photo using `GET /api/photos/:id` (use `useParams` to get the ID from the URL)
- Display:
  - The full-size photo (scaled to fit the viewport, not cropped)
  - The caption
  - Tags (if any), displayed as small chips/badges
  - The upload date, nicely formatted (e.g., "May 10, 2026")
  - A mini-map showing the photo's pinned location (small `MapContainer` with a single marker, zoom ~14, non-interactive)
- Add a "Delete" button that calls `DELETE /api/photos/:id`, confirms with the user, and redirects to the gallery on success
- Add a "Back to Gallery" link
- Handle the case where the photo doesn't exist (show a "Photo not found" message)

### 4. Add an edit caption feature

- Add an "Edit" button next to the caption on the detail page
- When clicked, replace the caption text with an input field pre-filled with the current caption
- Add "Save" and "Cancel" buttons
- On save, send a `PUT /api/photos/:id` request with the updated caption
- Update the displayed caption on success without a full page reload

### 5. Add routes and update navigation

- Add these routes in `App.jsx`:
  - `/gallery` → `GalleryPage`, wrapped in `ProtectedRoute`
  - `/photos/:id` → `PhotoDetailPage`, wrapped in `ProtectedRoute`
- Update the Navbar to add a "Gallery" link (visible only when logged in)

When you modify `App.jsx`, just add your new `<Route>` lines inside the existing `<Routes>` block. Same for Navbar — just add your `<Link>`. These are small additions that merge cleanly.

### 6. Style everything

- Style the gallery grid with consistent spacing and hover effects (e.g., slight scale on hover)
- Style the detail page layout — photo on one side, info on the other (or stacked on mobile)
- Make the mini-map a fixed small size (e.g., 300x200px) with no zoom/pan controls
- Make sure everything is responsive — test at mobile (375px), tablet (768px), and desktop (1200px+) widths

### 7. Write E2E tests

Create `tests/test_sprint7_update_photo.py` following the same pattern as `tests/test_sprint4_photos.py`. Use the shared fixtures from `conftest.py` (`base_url`, `auth_header`, `second_user_auth_header`).

Test the new `PUT /api/photos/:id` endpoint:

- [ ] Update caption → 200, response shows new caption
- [ ] Update tags → 200, response shows new tags array
- [ ] Update `isPublic` → 200, response shows updated boolean
- [ ] Update someone else's photo → 403
- [ ] Update nonexistent photo (fake ObjectId) → 404 or 500
- [ ] Update without auth → 401
- [ ] Verify the update persists — after PUT, GET the same photo by ID and confirm the changes are there
- [ ] Run `pytest -v tests/test_sprint7_update_photo.py` and confirm all tests pass

Tip: upload a test photo first in each test (or use a fixture), then PUT to update it. Look at `test_sprint4_photos.py` for how `make_test_image()` and the auth fixtures work. Remember to import `io` if you need `make_test_image`.

### 8. Test the full flow manually

- [ ] Upload a few test photos via Postman or curl (or via the map if Sprint 6 is merged)
- [ ] Gallery shows all user photos in a grid
- [ ] Clicking a photo navigates to its detail page
- [ ] Detail page shows full photo, caption, date, tags, and mini-map
- [ ] Edit caption works (saves to backend, UI updates)
- [ ] Delete from detail page works (redirects to gallery)
- [ ] Gallery and detail pages are protected (redirect to login if not authenticated)
- [ ] Empty state shows correctly when no photos exist

---

## Merge Conflict Notes

Low conflict risk. This sprint creates 4 new files and makes small additions to shared files:

- **`App.jsx`** — adds 2 `<Route>` lines. If another sprint also adds routes, just keep both sets of lines.
- **`Navbar.jsx`** — adds a "Gallery" link. If another sprint also adds links, keep both.
- **`photoController.js`** — adds a new `updatePhoto` function at the bottom + updates the `module.exports`. Just include all functions in the export.
- **`photoRoutes.js`** — adds one `router.put()` line. No conflict with sprints adding other routes.

---

## Deliverables Checklist

- [ ] `PUT /api/photos/:id` backend endpoint for updating caption/tags/isPublic
- [ ] Gallery page at `/gallery` with responsive photo grid
- [ ] Photo detail page at `/photos/:id` with full photo + metadata + mini-map
- [ ] Edit caption functionality on the detail page
- [ ] Delete from detail page with confirmation
- [ ] Navbar updated with Gallery link
- [ ] Responsive layout (mobile/tablet/desktop)
- [ ] E2E tests pass: `pytest -v tests/test_sprint7_update_photo.py`

---

## File Structure

```
src/
├── pages/
│   ├── GalleryPage.jsx        (new)
│   ├── GalleryPage.css        (new)
│   ├── PhotoDetailPage.jsx    (new)
│   └── PhotoDetailPage.css    (new)
├── components/
│   └── Navbar.jsx             (modified — add Gallery link)
├── App.jsx                    (modified — add 2 routes)
server/
├── controllers/
│   └── photoController.js     (modified — add updatePhoto function + export)
└── routes/
    └── photoRoutes.js         (modified — add PUT route)
tests/
└── test_sprint7_update_photo.py   (new)
```
