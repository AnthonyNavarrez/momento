# Sprint 11: Integration Wiring

**Assignee:** Gokul
**Goal:** Wire up the loose connections between existing components and APIs left over from parallel sprint merges. No new files — this is purely connecting things that already exist.
**Dependencies:** Sprints 1–10 (all merged into main).

---

## Background

Sprints 6–10 were developed in parallel, so each sprint built its pieces in isolation. Now that everything is merged, there are four integration gaps where a component exists but isn't connected to its backend or to other components. This sprint closes all of them.

**No new components or endpoints are needed.** Everything referenced below already exists in the codebase:
- `SearchBar` component (`src/components/SearchBar.jsx`) — renders, debounces, calls `onSearch(filters)`
- `TagInput` component (`src/components/TagInput.jsx`) — controlled add/remove tag chips
- `GET /api/photos/search` endpoint — accepts `q`, `tags`, `startDate`, `endDate`, `page`, `limit`
- `PUT /api/photos/:id` endpoint — accepts `tags` in the request body
- `GalleryPage` (`src/pages/GalleryPage.jsx`) — currently shows all user photos, SearchBar logs to console
- `PhotoUpload` modal (`src/components/PhotoUpload.jsx`) — has file, caption, isPublic but no tags
- `PhotoDetailPage` (`src/pages/PhotoDetailPage.jsx`) — shows tags read-only, no edit UI

---

## Tasks

### 1. Wire SearchBar to the search API on GalleryPage

**File:** `src/pages/GalleryPage.jsx`

Right now the `SearchBar` on the gallery page has a placeholder callback:
```js
onSearch={(filters) => console.log(filters)}
```
This needs to actually call `GET /api/photos/search` and display filtered results.

- [ ] Add state to track whether the user is actively filtering vs. showing all photos
- [ ] Replace the `console.log` callback with a function that calls `api.get('/photos/search', { params })`:
  - Map the `filters` object from SearchBar (`{ q, tags, startDate, endDate }`) to query params
  - If `filters.tags` is an array, join it as a comma-separated string for the API: `tags.join(',')`
  - If all filters are empty (no `q`, no tags, no dates), fall back to the existing `api.get('/photos')` to show all photos
- [ ] Update `resultCount` and `totalCount` props on SearchBar:
  - When filtering: `resultCount` = number of photos on screen, `totalCount` = `totalPhotos` from the search API response
  - When not filtering: both equal `photos.length`
- [ ] Handle pagination: if search results are paginated, add a "Load More" button (same pattern as ExplorePage) or load all results up to a reasonable limit

**How to test:**
1. Upload several photos with different captions via the map
2. Go to Gallery, type a caption keyword in the search bar → only matching photos appear
3. Clear the search → all photos reappear
4. Try date range filtering → only photos in that range appear

### 2. Add TagInput to the PhotoUpload modal

**File:** `src/components/PhotoUpload.jsx`

The upload modal currently has file, caption, and isPublic fields but no way to add tags. The `TagInput` component exists and the backend already parses `tags` from form data as `JSON.parse(tags)`.

- [ ] Import `TagInput` from `'../components/TagInput'`
- [ ] Add a `tags` state: `const [tags, setTags] = useState([])`
- [ ] Reset `tags` to `[]` in the `useEffect` cleanup when `open` changes (alongside the existing resets for file, caption, etc.)
- [ ] Render the `TagInput` component in the form, between the caption input and the public checkbox:
  ```jsx
  <div className="form-row">
      <label>Tags (optional)</label>
      <TagInput tags={tags} onChange={setTags} />
  </div>
  ```
- [ ] In `handleSubmit`, append tags to the form data if any exist:
  ```js
  if (tags.length > 0) formData.append('tags', JSON.stringify(tags))
  ```
  This matches how the backend parses tags: `tags ? JSON.parse(tags) : []`

**How to test:**
1. Click on the map to open the upload modal
2. Type a tag and press Enter → chip appears
3. Add multiple tags, remove one by clicking X
4. Submit the photo → check the photo in Gallery or via `GET /api/photos` to confirm tags are saved
5. Upload without tags → should still work (empty array)

### 3. Add tag editing on PhotoDetailPage

**File:** `src/pages/PhotoDetailPage.jsx`

Tags currently display as read-only text on the detail page. For the photo owner, they should be editable using the `TagInput` component and saved via `PUT /api/photos/:id`.

- [ ] Import `TagInput` from `'../components/TagInput'`
- [ ] Display the current tags. If the photo has tags and the viewer is NOT the owner, show them as read-only chips (styled spans). If the photo has no tags and the viewer is not the owner, show nothing.
- [ ] If the viewer IS the owner, render `TagInput` pre-filled with the photo's current tags:
  ```jsx
  <TagInput tags={photo.tags || []} onChange={handleTagsChange} />
  ```
- [ ] Implement `handleTagsChange`:
  - Call `api.put(`/photos/${id}`, { tags: newTags })` to save immediately (or debounce if preferred)
  - Update the local `photo` state with the response so the UI reflects the change
  - Show a brief error if the save fails
- [ ] Place the tags section in the detail info area, after the location and before the owner actions

**How to test:**
1. Navigate to a photo you own → see TagInput with existing tags
2. Add a new tag, press Enter → tag saves, persists on refresh
3. Remove a tag → saves, persists on refresh
4. View someone else's public photo → tags display as read-only chips, no input field
5. View a photo with no tags as non-owner → no tags section shown

### 4. Tag-based navigation from Gallery to filtered results

**Files:** `src/pages/GalleryPage.jsx`, `src/pages/PhotoDetailPage.jsx`

When a user sees tags on a photo (in the gallery grid cards or on the detail page), clicking a tag should navigate to the gallery filtered by that tag.

- [ ] In `GalleryPage.jsx`, read initial filter state from URL search params using `useSearchParams` from React Router:
  ```js
  const [searchParams, setSearchParams] = useSearchParams();
  ```
  On mount, check if `searchParams.get('tags')` exists and pre-populate the SearchBar / trigger a search with that tag
- [ ] In the gallery grid cards (`GalleryPage.jsx`), make tag chips clickable:
  ```jsx
  <span key={i} className="tag clickable" onClick={(e) => {
      e.stopPropagation(); // don't open the photo modal
      setSearchParams({ tags: tag });
  }}>{tag}</span>
  ```
- [ ] In `PhotoDetailPage.jsx`, render tags as clickable links that navigate to the gallery filtered by that tag:
  ```jsx
  <span className="tag clickable" onClick={() => navigate(`/gallery?tags=${tag}`)}>
      {tag}
  </span>
  ```
  Show these for non-owners (read-only view). For owners, the TagInput handles display instead.
- [ ] Add a `.clickable` CSS modifier to the tag styles so they look interactive (cursor pointer, hover effect)

**How to test:**
1. Go to Gallery → see tags on photo cards
2. Click a tag → gallery filters to show only photos with that tag, SearchBar reflects the filter
3. On a public photo detail page (not yours) → click a tag → navigates to `/gallery?tags=tagname`
4. Direct URL `/gallery?tags=beach` → loads gallery pre-filtered by "beach"
5. Clear filters → returns to all photos

---

## Files Modified

```
src/pages/GalleryPage.jsx          (Tasks 1, 4)
src/components/PhotoUpload.jsx     (Task 2)
src/pages/PhotoDetailPage.jsx      (Tasks 3, 4)
src/pages/GalleryPage.css          (Task 4 — .tag.clickable styles)
src/pages/PhotoDetailPage.css      (Task 4 — .tag.clickable styles)
```

No new files. No backend changes.

---

## Merge Conflict Notes

**Very low risk.** All changes are in existing component files that no other sprint is touching. The only shared patterns are the tag chip CSS classes — keep styles consistent across GalleryPage and PhotoDetailPage.

---

## Deliverables Checklist

- [ ] SearchBar on GalleryPage calls `/api/photos/search` and displays filtered results
- [ ] Clearing all filters reverts to showing all photos
- [ ] SearchBar result count reflects actual search totals
- [ ] TagInput integrated into PhotoUpload modal, tags saved on upload
- [ ] Tags editable by owner on PhotoDetailPage via TagInput
- [ ] Tags read-only for non-owners on PhotoDetailPage
- [ ] Clicking a tag anywhere navigates to gallery filtered by that tag
- [ ] URL params (`/gallery?tags=x`) pre-populate the filter on page load
