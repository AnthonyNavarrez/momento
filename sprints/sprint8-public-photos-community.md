# Sprint 8: Public Photos & Community Feed

**Assignee:** TBD
**Goal:** Let users mark photos as public, build a public photos API with pagination, create an Explore page, and create the `optionalAuth` middleware. Community photo data on the map will be handled by Sprint 9 (heatmap), not individual pins.
**Dependencies:** Sprints 1–5 (already merged into main). No dependency on Sprints 6, 7, 9, or 10 — can start immediately.
**Parallel notes:** The backend work (public API, optionalAuth) is entirely new functions and routes — zero conflict with other sprints. The Explore page is a brand-new file. The only integration points are small additions to `App.jsx` (route), `Navbar.jsx` (link), and `photoController.js`/`photoRoutes.js` (new exports). After Sprint 6 merges, you can add the public toggle to the upload modal as a quick follow-up. **Note:** community photo data on the map is shown as a heatmap (Sprint 9), not as individual pins — this keeps the map clean and avoids cluttering it with hundreds of markers.

---

## Before You Start

**Check the README.md** at the project root for instructions on setting up the dev environment and running the app (both frontend and backend).

### Git Workflow

Your typical workflow once you receive a sprint should be:

1. Start on the `main` branch
2. `git pull` + `npm install` (in both root and `server/`) to make sure you are up to date
3. `git switch -c <your-branch>` — e.g. `yourname/sprint8`
4. Do `git add` & `git commit` while working (frequently + descriptive messages)
5. `git push origin <your-branch>` to push your local branch to GitHub
6. When you are done with your sprint, pull from main once more to resolve any merge conflicts early
7. Create a pull request on GitHub with a descriptive description, and then we can merge it safely!

---

## Background (read this first)

Right now all photos are private by default. The Photo model already has an `isPublic` field (defaults to `false`), but nothing uses it yet. This sprint adds the ability to share photos publicly and browse what the community has posted.

**How to test without other sprints:** You can create test photos with `isPublic: true` via curl:
```bash
curl -X POST http://localhost:5001/api/photos \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "photo=@/path/to/image.jpg" \
  -F "lat=34.0522" \
  -F "lng=-118.2437" \
  -F "caption=Public test photo" \
  -F "isPublic=true"
```
Note: this requires a small tweak to `photoController.js`'s `uploadPhoto` function to read `isPublic` from `req.body` (add it if it's not there — check Task 2 below).

**Key concepts:**
- **Public vs. private** — the `isPublic` flag on each photo controls visibility. Private photos are only visible to their owner. Public photos can be seen by anyone.
- **Populate** — Mongoose's `.populate()` method lets you replace an ObjectId reference with the actual document. So instead of `user: "abc123"`, you get `user: { username: "gokul", ... }`. This is how we show usernames on public photos.
- **Query parameters** — for filtering and pagination, the API can accept query params like `?page=2&limit=20`. Express reads these from `req.query`.
- **Pagination** — loading all photos at once would be slow with thousands of entries. We load a page at a time (e.g., 20 photos) and let the user load more.

**Useful resources:**
- [Mongoose populate docs](https://mongoosejs.com/docs/populate.html)
- [Mongoose query helpers](https://mongoosejs.com/docs/queries.html) — for `.skip()`, `.limit()`, `.sort()`
- [Express req.query docs](https://expressjs.com/en/api.html#req.query)
- Search for "react infinite scroll" or "react load more button" for frontend pagination patterns

---

## Tasks

### 1. Create the `optionalAuth` middleware

- [ ] In `server/middleware/auth.js`, add and export an `optionalAuth` function
- [ ] It should work almost identically to `protect`, but:
  - If a valid token is present → attach `req.user` and call `next()` (same as `protect`)
  - If NO token is present → just call `next()` without setting `req.user` (instead of returning 401)
  - If an INVALID token is present → still call `next()` without `req.user` (be lenient)
- [ ] Export both: `module.exports = { protect, optionalAuth }` (keep `protect` as a named export too, or add `optionalAuth` alongside the existing default export)
  > This middleware lets routes work for both logged-in and anonymous users. Controllers check `req.user` to adjust behavior.

### 2. Update `uploadPhoto` to support `isPublic`

- [ ] In `server/controllers/photoController.js`, modify the `uploadPhoto` function to read `isPublic` from `req.body`
- [ ] When creating the Photo document, include: `isPublic: req.body.isPublic === 'true'`
  > Since multipart form data sends everything as strings, you need to compare against the string `'true'`, not a boolean.

### 3. Add backend API for public photos

- [ ] Create a new controller function `getPublicPhotos` in `server/controllers/photoController.js`:
  - Query all photos where `isPublic: true`
  - Support pagination via query params: `page` (default 1) and `limit` (default 20)
  - Sort by `createdAt` descending (newest first)
  - Use `.populate('user', 'username')` to include the uploader's username (not their email/password)
  - Return: `{ photos: [...], page, totalPages, totalPhotos }`
  > Use `.skip((page - 1) * limit).limit(limit)` for pagination. Use `Photo.countDocuments({ isPublic: true })` to get the total count.

- [ ] Add the route: `GET /api/photos/public` in `server/routes/photoRoutes.js`
  - This route should NOT require authentication (anyone can browse public photos)
  - **Important:** define this route BEFORE the `GET /api/photos/:id` route, otherwise Express will treat "public" as an ID parameter

### 4. Update `getPhotoById` for unauthenticated access

- [ ] Modify the `getPhotoById` controller to allow unauthenticated users to view public photos:
  - If the photo is public → return it regardless of auth status
  - If the photo is private and `req.user` exists and owns it → return it
  - If the photo is private and user is unauthenticated or doesn't own it → return 403
- [ ] In `photoRoutes.js`, change `GET /api/photos/:id` to use `optionalAuth` instead of `protect`

### 5. Create the Explore page

- [ ] Create `src/pages/ExplorePage.jsx` and `src/pages/ExplorePage.css`
- [ ] This page shows a feed of all public photos from all users
- [ ] Fetch from `GET /api/photos/public` (no auth required, but include token if available)
- [ ] Display as a responsive grid, where each card shows:
  - Photo thumbnail
  - Caption
  - Username of the uploader (from the populated `user` field)
  - Upload date
- [ ] Add a "Load More" button at the bottom that fetches the next page
  - Track the current page in state
  - Append new photos to the existing list (don't replace)
  - Hide the button when there are no more pages
- [ ] Clicking a photo should navigate to its detail page (`/photos/:id`)
  > If Sprint 7 (detail page) isn't merged yet, the link will 404 — that's fine, it'll work once Sprint 7 merges.

### 6. Add routing and navigation

- [ ] Add `/explore` route in `App.jsx` — this page should be accessible WITHOUT login (don't wrap in `ProtectedRoute`)
- [ ] Update the Navbar:
  - "Explore" link should always be visible (logged in or out)
  - When logged in: Map | Gallery | Explore | Logout
  - When logged out: Explore | Login | Sign Up

### 7. Post-merge integration tasks

These tasks depend on other sprints being merged first. **Skip them for now** and do them after merging, or create a small follow-up PR:

- [ ] **After Sprint 6 merges:** Add a "Share publicly" checkbox to the `PhotoUpload` modal. When checked, include `isPublic: true` in the form data.
- [ ] **After Sprint 7 merges:** On the photo detail page, add a public/private toggle for the owner. Use the `PUT /api/photos/:id` endpoint to update `isPublic`. Show non-owners the photo without edit/delete controls.

> **Note:** Community photo data on the map is NOT shown as individual pins — that would clutter the map. Instead, Sprint 9 adds a community heatmap overlay that the user can toggle to. See Sprint 9 for details on the map view toggle.

### 8. Write E2E tests

Create `tests/test_sprint8_public_photos.py` following the same pattern as `tests/test_sprint4_photos.py`. Use the shared fixtures from `conftest.py`.

Test the public photos API and optionalAuth behavior:

- [ ] Upload a photo with `isPublic=true` → 201, response has `isPublic: true`
- [ ] Upload a photo without `isPublic` → 201, response has `isPublic: false` (default)
- [ ] `GET /api/photos/public` → 200, returns `{ photos, page, totalPages, totalPhotos }`
- [ ] Public photos list includes the uploader's username (populated `user` field)
- [ ] Public photos list does NOT include private photos
- [ ] Pagination: upload several public photos, request `?page=1&limit=2` → returns 2 photos + correct `totalPages`
- [ ] `GET /api/photos/public` works without auth (no token) → 200
- [ ] `GET /api/photos/:id` for a public photo works without auth → 200
- [ ] `GET /api/photos/:id` for a private photo without auth → 403
- [ ] `GET /api/photos/:id` for a private photo with the owner's auth → 200
- [ ] Run `pytest -v tests/test_sprint8_public_photos.py` and confirm all tests pass

> **Tip:** you'll need to upload photos with `isPublic` in the form data. Add `"isPublic": "true"` to the `data` dict when calling `requests.post()`. For unauthenticated requests, just omit the `headers` parameter.

### 9. Test the full flow manually

- [ ] Create test photos with `isPublic: true` (via curl or the upload modal if Sprint 6 is merged)
- [ ] `GET /api/photos/public` returns only public photos with usernames
- [ ] Explore page shows public photos in a grid
- [ ] Pagination works (Load More button fetches next page)
- [ ] View Explore page while logged out → public photos are visible
- [ ] Click a public photo → navigates to detail page (works once Sprint 7 is merged)
- [ ] `GET /api/photos/:id` works for public photos without auth
- [ ] `GET /api/photos/:id` still blocks private photos for non-owners

---

## Merge Conflict Notes

**Low conflict risk.** This sprint mostly creates new files and adds new functions:
- `photoController.js` — adds `getPublicPhotos` function + updates exports. Other sprints also add functions here. When merging, just make sure all functions are included in the export object.
- `photoRoutes.js` — adds `GET /public` route. Other sprints add other routes. Keep all route lines; order matters: named routes (`/public`, `/search`, `/heatmap`) must come BEFORE `/:id`.
- `auth.js` — adds `optionalAuth` export alongside existing `protect`. If another sprint also modifies the export, keep both.
- `App.jsx` — adds one `<Route>` line. Just keep all route lines from all sprints.
- `Navbar.jsx` — adds "Explore" link. Just keep all links from all sprints.

## Deliverables Checklist

- [ ] `optionalAuth` middleware exported from `server/middleware/auth.js`
- [ ] `uploadPhoto` accepts `isPublic` from form data
- [ ] `GET /api/photos/public` endpoint with pagination and user populate
- [ ] `GET /api/photos/:id` works for public photos without auth
- [ ] Explore page at `/explore` with paginated grid of public photos
- [ ] Explore page accessible without login
- [ ] Navbar updated with Explore link (always visible)
- [ ] E2E tests pass: `pytest -v tests/test_sprint8_public_photos.py`

## File Structure

```
src/
├── pages/
│   ├── ExplorePage.jsx        (new)
│   └── ExplorePage.css        (new)
├── components/
│   └── Navbar.jsx             (modified — add Explore link)
├── App.jsx                    (modified — add /explore route)

NOTE: This sprint does NOT modify Map.jsx. Community data on the map
is handled by Sprint 9 (heatmap overlay), not individual pins.

server/
├── controllers/
│   └── photoController.js     (modified — add getPublicPhotos, update uploadPhoto + exports)
├── routes/
│   └── photoRoutes.js         (modified — add /public route, change /:id to optionalAuth)
└── middleware/
    └── auth.js                (modified — add optionalAuth export)

tests/
└── test_sprint8_public_photos.py  (new)
```
