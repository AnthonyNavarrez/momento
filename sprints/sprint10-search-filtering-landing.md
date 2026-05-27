# Sprint 10: Search, Filtering & Landing Page

**Assignee:** TBD
**Goal:** Add photo tagging, search/filter functionality, build reusable UI components (`TagInput`, `SearchBar`), and create a landing page. This sprint mostly creates new files and can be worked on immediately.
**Dependencies:** Sprints 1–5 (already merged into main). No dependency on Sprints 6, 7, 8, or 9 — can start immediately.
**Parallel notes:** Almost everything in this sprint is new files (`TagInput`, `SearchBar`, `LandingPage`, search API). The backend search endpoint is a new function and route. After other sprints merge, there are small integration tasks (wiring `TagInput` into the upload modal and detail page) that can be done as a quick follow-up.

---

## Before You Start

Check the `README.md` at the project root for instructions on setting up the dev environment and running the app (both frontend and backend).

## Git Workflow

1. Start on the `main` branch
2. `git pull` + `npm install` (in both root and `server/`) to make sure you are up to date
3. `git switch -c <your-branch>` — e.g. `yourname/sprint10`
4. Do `git add` & `git commit` while working (frequently + descriptive messages)
5. `git push origin <your-branch>` to push your local branch to GitHub
6. When you are done with your sprint, pull from main once more to resolve any merge conflicts early
7. Create a pull request on GitHub with a descriptive description, and then we can merge it safely!

---

## Background (read this first)

The Photo model already supports `tags` (an array of strings) and `caption`, but there's no way to search by them yet. This sprint adds a search bar that filters photos by caption text and tags, plus tag management in the upload and detail views. It also adds a landing page for logged-out users.

**How to develop without other sprints:** The search API works against the existing photo data. You can create test photos with tags via curl:

```bash
curl -X POST http://localhost:5001/api/photos \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "photo=@/path/to/image.jpg" \
  -F "lat=34.0522" \
  -F "lng=-118.2437" \
  -F "caption=Sunset at the pier" \
  -F 'tags=["sunset","beach","pier"]'
```

The `TagInput` and `SearchBar` components can be built and tested in isolation — they're just controlled React components with props.

**Key concepts:**
- **Text search** — MongoDB supports basic text matching with `$regex` for simple searches. For our scale, regex is fine (you don't need full-text search indexes).
- **Tag input UX** — a common pattern where users type a tag and press Enter to add it as a "chip" (a small pill-shaped badge). Tags can be removed by clicking an X.
- **Debouncing** — when searching as the user types, you don't want to fire an API call on every keystroke. Debouncing waits until the user stops typing for a short period (e.g., 300ms) before making the request.
- **Responsive design** — making layouts adapt to different screen sizes using CSS media queries, flexbox, and grid.

**Useful resources:**
- [MongoDB $regex operator](https://www.mongodb.com/docs/manual/reference/operator/query/regex/)
- Search for "react debounce patterns" — or just use `setTimeout`/`clearTimeout`
- [CSS media queries (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)
- Search for "react tag input component tutorial" for tag input UX patterns

---

## Tasks

### 1. Add the search/filter API endpoint

Create a new controller function `searchPhotos` in `server/controllers/photoController.js`:

- Accept query params: `q` (search text), `tags` (comma-separated), `startDate`, `endDate`
- Build a MongoDB query dynamically based on which params are provided:
  - `q` → search both `caption` and `tags` using case-insensitive `$regex`:
    ```js
    { $or: [
      { caption: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } }
    ]}
    ```
  - `tags` → match photos containing ANY of the specified tags: `{ tags: { $in: tagsArray } }`
  - `startDate`/`endDate` → filter by `createdAt` range using `$gte` and `$lte`
- For the user's own photos, always filter by `user: req.user.id`
- Support pagination (`page` + `limit` query params, same pattern as Sprint 8's public API)
- Return: `{ photos: [...], page, totalPages, totalPhotos }`

Build the query object conditionally: start with `{ user: req.user.id }`, then add each filter only if the corresponding query param exists.

Add the route: `GET /api/photos/search` in `server/routes/photoRoutes.js`

- This route requires authentication (searching your own photos)
- **Important:** define it BEFORE `GET /api/photos/:id`

### 2. Build the `TagInput` component

- Create `src/components/TagInput.jsx` and `src/components/TagInput.css`
- The component should:
  - Show existing tags as removable chips/pills
  - Have a text input where users can type a new tag
  - On pressing Enter or comma, add the typed text as a new tag (trim whitespace, lowercase)
  - Prevent duplicate tags
  - Allow removing tags by clicking the X on each chip
  - Accept `tags` and `onChange` props (controlled component pattern)
- Style the chips: rounded, colored background, small X button, inline-flow layout
- Test it in isolation: temporarily render it on any page to verify it works before wiring it into the upload/detail flows

### 3. Build the `SearchBar` component

- Create `src/components/SearchBar.jsx` and `src/components/SearchBar.css`
- Include:
  - A text input for free-text search (searches captions and tags)
  - A tag filter section (clickable chips for commonly-used tags)
  - Optional: date range picker (two date inputs for start/end)
  - A "Clear filters" button (visible when any filter is active)
  - A result count display: "Showing 12 of 45 photos"
- Debounce the text input — wait 300ms after the user stops typing before calling the callback

Use a `useEffect` with a `setTimeout`. Clear the timeout on each keystroke:

```js
useEffect(() => {
  const timer = setTimeout(() => onSearch(query), 300);
  return () => clearTimeout(timer);
}, [query]);
```

- Accept props: `onSearch(filters)`, `resultCount`, `totalCount`
- The component should NOT fetch data itself — it calls `onSearch` with the filter values and lets the parent handle the API call

### 4. Create the landing page

- Create `src/pages/LandingPage.jsx` and `src/pages/LandingPage.css`
- This is the home page for logged-out users at `/`
- Include:
  - A hero section with a tagline (e.g., "Pin your memories to the map")
  - A brief description of Momento's features (upload, pin, explore, heatmaps)
  - Call-to-action buttons: "Sign Up" and "Explore"
  - Clean, visually appealing layout
- If the user is already logged in, redirect to `/map` (use `useAuth()` to check + `<Navigate>`)
- Add the route in `App.jsx`: `/` → `LandingPage`

Replace the current `/` redirect with this page component that conditionally redirects logged-in users.

### 5. Post-merge integration tasks

These tasks wire the new components into pages from other sprints. Do them after those sprints merge, or as a quick follow-up PR:

- **After Sprint 6 merges:** In the `PhotoUpload` modal, replace any plain tags input with the `TagInput` component. Serialize tags as `JSON.stringify(tags)` in the form data.
- **After Sprint 7 merges:** On the `PhotoDetailPage`, show tags as clickable chips. In the edit flow, use the `TagInput` component for editing tags. Clicking a tag navigates to `/gallery?tags=<tag>`.
- **After Sprint 7 merges:** Add the `SearchBar` component to the top of `GalleryPage`. When no filters are active, show all photos (existing behavior). When filters are active, fetch from `GET /api/photos/search` instead and show results with the count. Use `useSearchParams` from React Router to maintain filter state in the URL.

### 6. Write E2E tests

Create `tests/test_sprint10_search.py` following the same pattern as `tests/test_sprint4_photos.py`. Use the shared fixtures from `conftest.py`.

Upload photos with different captions and tags for test data:
- Photo A: caption "Sunset at the pier", tags `["sunset","beach"]`
- Photo B: caption "Coffee shop on Main", tags `["coffee","food"]`
- Photo C: caption "Beach volleyball", tags `["beach","sports"]`

Test the new `GET /api/photos/search` endpoint:

- [ ] Search by caption text: `?q=sunset` → returns Photo A only
- [ ] Search by tag text: `?q=beach` → returns Photos A and C (matches caption and tag)
- [ ] Filter by tag: `?tags=beach` → returns Photos A and C
- [ ] Filter by multiple tags: `?tags=beach,coffee` → returns Photos A, B, and C (any match)
- [ ] Search with no results: `?q=nonexistent` → returns empty array, `totalPhotos: 0`
- [ ] Date range filter: `?startDate=<today>&endDate=<today>` → returns today's uploads
- [ ] Combined filters: `?q=beach&tags=sunset` → returns only photos matching both
- [ ] Pagination: `?q=&page=1&limit=1` → returns 1 photo + correct `totalPages`
- [ ] Search requires auth: `GET /api/photos/search?q=test` without token → 401
- [ ] Run `pytest -v tests/test_sprint10_search.py` and confirm all tests pass

Tip: upload the test photos at the start of your test class (or in a fixture), then run search queries against them. Use `time.strftime` to get today's date for the date range filter.

### 7. Test the full flow manually

- [ ] Create photos with various tags and captions via curl
- [ ] `GET /api/photos/search?q=sunset` returns matching photos
- [ ] `GET /api/photos/search?tags=beach,pier` returns photos with those tags
- [ ] `GET /api/photos/search?startDate=2026-01-01&endDate=2026-06-01` filters by date
- [ ] Combined filters work correctly
- [ ] `TagInput` component: add tags, remove tags, no duplicates, Enter/comma to add
- [ ] `SearchBar` component: debounced search, clear filters, result count
- [ ] Landing page shows for logged-out users, redirects logged-in users to `/map`

---

## Merge Conflict Notes

Very low conflict risk. This sprint creates 8+ new files. The shared file touches are small:

- **`photoController.js`** — adds `searchPhotos` function + export. Other sprints also add functions. Include all in the export object.
- **`photoRoutes.js`** — adds `GET /search` route. Keep all routes; named routes before `/:id`.
- **`App.jsx`** — changes the `/` route to `LandingPage`. If another sprint also touches the `/` route, keep the `LandingPage` version (it handles the redirect-if-logged-in logic).

---

## Deliverables Checklist

- [ ] `GET /api/photos/search` endpoint with text, tag, and date filtering
- [ ] Reusable `TagInput` component for adding/removing tags
- [ ] Reusable `SearchBar` component with debounced search
- [ ] Landing page at `/` for logged-out users
- [ ] All new components tested in isolation
- [ ] E2E tests pass: `pytest -v tests/test_sprint10_search.py`

---

## File Structure

```
src/
├── components/
│   ├── TagInput.jsx           (new)
│   ├── TagInput.css           (new)
│   ├── SearchBar.jsx          (new)
│   └── SearchBar.css          (new)
├── pages/
│   ├── LandingPage.jsx        (new)
│   └── LandingPage.css        (new)
├── App.jsx                    (modified — landing page route)
server/
├── controllers/
│   └── photoController.js     (modified — add searchPhotos + export)
└── routes/
    └── photoRoutes.js         (modified — add GET /search route)
tests/
└── test_sprint10_search.py    (new)
```
