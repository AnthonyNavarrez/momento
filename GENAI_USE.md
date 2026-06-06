# Generative AI Use Disclosure

This file documents generative AI assistance used while creating Momento following the course policy format.

```js
// [GenAI Use] Prompt: "..."
// [GenAI Use] LLM Response Start
// ...
// [GenAI Use] LLM Response End
// [GenAI Use] Reflection: "..."
// [GenAI Use] Ownership: "...%"
```

---

# echen078-Authored Feature Disclosures
## Notes

Some prompts below are reconstructed from memory because the exact original chat transcripts were not preserved. The descriptions are intended to accurately represent the type of assistance received and how the generated output was used.

All generated code, suggestions, and documentation were reviewed, modified, tested, and integrated into the project before being committed.

## Overall Ownership Estimate

I feel ownership over approximately 75% of the code I personally committed.

Generative AI was primarily used for implementation guidance, debugging support, React/Express patterns, test generation, and documentation drafting. I reviewed all generated outputs, adapted them to the existing codebase, and verified behavior through manual testing and project requirements before committing changes.


## Sprint 3 Map Integration

```js
// [GenAI Use] Prompt:
// "Sprint 3 — Frontend Map Integration (Ellen). Set up an interactive Leaflet map in our Vite + React app: install react-leaflet and leaflet, import leaflet.css in main.jsx, and fix the default marker icon issue with Vite (L.Icon.Default.mergeOptions with imported icon/shadow images). Build src/components/Map/Map.jsx using MapContainer and TileLayer centered on Los Angeles [34.0522, -118.2437] at zoom 12 with OpenStreetMap tiles. Add a useMapEvents helper inside MapContainer that logs lat/lng on map click. Create a reusable MapPin.jsx component (Marker + Popup, accepts position and children). Demo with 4–5 hardcoded LA pins (Santa Monica Pier, Griffith Observatory, UCLA, Grand Central Market). Style with Map.css so the map is full viewport (100% width, 100vh) with no overflow glitches."

// [GenAI Use] LLM Response Start
// The LLM suggested using React Leaflet components such as MapContainer, TileLayer, Marker, Popup, and useMapEvents. It also suggested creating a reusable MapPin component, importing Leaflet CSS correctly, and styling the map container.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I adapted the suggestions to the existing project structure, created the Map and MapPin components, integrated them into the application, and tested the functionality locally.

// [GenAI Use] Ownership: 70%
//
// I feel ownership over approximately 70% of the map integration code I committed. AI provided guidance on React Leaflet usage and structure, but I integrated the components, adjusted styling and configuration, and verified functionality through testing.
```

---

## Sprint 8 Public Photos and Community Explore Feed

```js
// [GenAI Use] Prompt:
// "Sprint 8 — Public Photos & Community Feed (Ellen). Backend: add optionalAuth middleware in auth.js (valid token sets req.user, missing/invalid token still calls next without 401). Update uploadPhoto to read isPublic from multipart form data (compare to string 'true'). Add getPublicPhotos in photoController.js — query isPublic: true, paginate with page/limit, sort by createdAt desc, populate user username, return { photos, page, totalPages, totalPhotos }. Route GET /api/photos/public before /:id. Change GET /api/photos/:id to optionalAuth so public photos are viewable without login; private photos return 403 for non-owners. Frontend: create ExplorePage.jsx/css — responsive grid of public photos (thumbnail, caption, username, date), Load More pagination, link to /photos/:id, no login required. Add /explore route in App.jsx (not ProtectedRoute) and always-visible Explore link in Navbar. Write tests/test_sprint8_public_photos.py covering isPublic upload, public listing, pagination, optionalAuth access rules. Do NOT add community pins to Map.jsx — Sprint 9 handles heatmap."

// [GenAI Use] LLM Response Start
// The LLM suggested public-photo routes, optional authentication, paginated API responses, React state management, and an Explore page UI for browsing public content.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I reviewed the authorization requirements, integrated the feature with existing backend and frontend patterns, and manually verified functionality.

// [GenAI Use] Ownership: 80%
//
// I feel ownership over approximately 80% of the public-photo/community-feed code I committed. AI assisted with implementation ideas, but I integrated the feature with the existing codebase and validated behavior myself.
```

---

## Sprint 8 Public Photo E2E Tests

```js
// [GenAI Use] Prompt:
// "Sprint 8 Task 8 — Write tests/test_sprint8_public_photos.py following test_sprint4_photos.py and conftest.py fixtures. Cover: upload with isPublic=true → 201 isPublic true; upload without isPublic → default false; GET /api/photos/public returns { photos, page, totalPages, totalPhotos } with populated username; private photos excluded; pagination ?page=1&limit=2; public list works without auth; GET /api/photos/:id for public photo without auth → 200; private photo without auth → 403; private photo with owner auth → 200."

// [GenAI Use] LLM Response Start
// The LLM suggested pytest test cases covering authentication, uploads, public-photo retrieval, private-photo protection, and robust assertions.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I reviewed the tests, adjusted assertions, integrated them with the existing test suite, and confirmed that they exercised actual API behavior.

// [GenAI Use] Ownership: 65%
//
// I feel ownership over approximately 65% of the test code I committed. AI generated initial testing patterns, but I modified and validated the tests before submission.
```

---

## Public/Private Sharing Controls in Upload and Photo Detail

```js
// [GenAI Use] Prompt:
// "Reconstructed/generalized prompt: Integrate public/private sharing across the photo upload flow and photo detail view. Users should be able to choose whether a photo is public, owners should be able to edit visibility, and the UI should clearly show public/private status."

// [GenAI Use] LLM Response Start
// The LLM suggested passing an isPublic field through upload forms, updating visibility through API routes, displaying public/private badges, and restricting edit controls to owners.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I adapted these ideas to the existing Photo model and UI components while verifying authorization behavior and owner-only controls.

// [GenAI Use] Ownership: 85%
//
// I feel ownership over approximately 85% of this feature. AI suggested a general implementation approach, but I adapted it to the project architecture and verified final behavior.
```

---

## Upload and Image Handling Improvements

```js
// [GenAI Use] Prompt:
// "Reconstructed/generalized prompt: Improve Momento's upload flow and backend image handling. Support common phone image formats, create the uploads directory if needed, normalize images when possible, and return clearer upload error messages."

// [GenAI Use] LLM Response Start
// The LLM suggested expanding upload validation, ensuring upload directories exist, improving error handling, and supporting additional image formats.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I reviewed the suggestions, integrated them into the existing upload pipeline, and verified expected upload scenarios.

// [GenAI Use] Ownership: 70%
//
// I feel ownership over approximately 70% of these changes. AI suggested approaches, while I adapted them to the project's existing upload architecture and tested the final implementation.
```

---

## Sprint 15 Gallery, Photo Detail & Search Restyle

```js
// [GenAI Use] Prompt:
// "Sprint 15 — Gallery, Photo Detail & Search Restyle (Ellen). After Sprint 12 design system is merged, restyle GalleryPage, SearchBar, PhotoDetailPage, PhotoDetailModal, and TagInput using shared tokens from App.css (var(--color-*), .card, .tag, .input, .btn, .btn-primary, .btn-danger, .overlay, .modal). Gallery: var(--color-bg-page) background, responsive auto-fill grid (minmax 300px, 3→2→1 columns), .card photo cards with cover images, orange .tag pills on cards (click-to-filter must still work), empty state message. SearchBar: .input with orange focus ring, date inputs matching .input, active filter chips with var(--color-primary-light) bg and × remove buttons, Clear all link, result count in var(--color-text-secondary). PhotoDetailPage: centered .card max-width 900px; PhotoDetailModal: .overlay + .modal, owner edit/delete controls, public/private badge pills. TagInput: replace old blue chips with orange .tag pills, × hover turns red, suggestions use gray hover states. Preserve existing URL tag sync (?tags=food,beach) and all search/filter/delete behavior — styling only, no logic regressions."

// [GenAI Use] LLM Response Start
// The LLM suggested React state-management patterns, filter handling, UI improvements, modal editing flows, and responsive layout refinements.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I integrated the ideas into existing gallery and photo-detail components and manually tested the resulting user experience.

// [GenAI Use] Ownership: 85%
//
// I feel ownership over approximately 85% of this work. AI provided implementation suggestions, but I integrated them into the existing application and verified functionality.
```

---

## Explore Revamp, Likes, and View-on-Map Flow

```js
// [GenAI Use] Prompt:
// "Reconstructed/generalized prompt: Improve the Explore page by adding community interactions and navigation. Add likes to public photos, mark my own uploads in the feed, allow owners to edit their own photos, and add a View on Map action from the photo detail modal."

// [GenAI Use] LLM Response Start
// The LLM suggested backend support for likes, frontend state management, conditional rendering for owner actions, and navigation between photo details and the map.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I validated authorization rules, integrated backend and frontend updates, and refined the user experience before committing the changes.

// [GenAI Use] Ownership: 85%
//
// I feel ownership over approximately 85% of this feature. AI assisted with implementation ideas, while I integrated the functionality and validated behavior across the application.
```

---

# gokulnambiar (gn-67) - Authored Feature Disclosures

## Notes

Prompts below are reconstructed from memory as exact transcripts were not preserved. I used Claude Code (CLI) as my primary GenAI tool throughout the project. My workflow was to describe what I needed, review the suggested approach or code, and either implement it myself based on the guidance or carefully review every edit before accepting. All generated code was tested manually before committing.

## Overall Ownership Estimate

I feel ownership over approximately 75-80% of the code I personally committed.

Generative AI was primarily used for planning implementation approaches, scaffolding boilerplate, generating tests from existing patterns, and debugging. I authored all 16 sprint specs myself without AI assistance, reviewed all generated code, and made final implementation decisions.

## Sprint 4 — Photo Upload API

```js
// [GenAI Use] Prompt:
// "I need to set up the photo upload API for Momento. We need Multer disk storage configuration that accepts JPEG, PNG, and HEIC files up to 10MB, with timestamped filenames. What is the best way to do this?
// Build a photoController with uploadPhoto (accepts multipart form data with lat/lng/caption/tags), getUserPhotos (sorted by createdAt desc), getPhotoById (owner or public access), and deletePhoto (owner only). Wire up routes at /api/photos with JWT protect middleware."

// [GenAI Use] LLM Response Start
// The LLM suggested Multer configuration with file filtering, controller functions with try/catch error handling, and RESTful route definitions with middleware chaining.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I used the suggestions as a starting point but adapted the Multer config, error messages, and response shapes to match our existing auth controller patterns. I tested all endpoints manually with Postman before committing.

// [GenAI Use] Ownership: 75%
//
// AI provided the boilerplate structure, but I adapted it to our codebase conventions, configured storage paths, and validated all edge cases (invalid file types, missing fields, unauthorized access).
```

---

## Sprint 9 — Community Heatmap

```js
// [GenAI Use] Prompt:
// "Add a community heatmap to the map page. Backend: create a GET /api/photos/heatmap endpoint that aggregates public photo locations with optional period filtering (week/month/year) using MongoDB date queries. Frontend: build a HeatmapLayer component that wraps the leaflet.heat plugin as a renderless React component, and a MapViewToggle component to switch between 'My Photos' and 'Community Heatmap' views with period filter buttons."

// [GenAI Use] LLM Response Start
// The LLM suggested a backend aggregation approach using $gte date filtering, a renderless React component pattern for the Leaflet heat plugin, and a toggle UI with period buttons.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// The heatmap required integrating an imperative Leaflet plugin (leaflet.heat) with React's declarative model. I reviewed the suggested renderless component pattern, understood the useMap/useEffect approach, and implemented it with proper cleanup. The backend aggregation logic I largely wrote myself based on the suggested $gte pattern.

// [GenAI Use] Ownership: 80%
//
// The renderless component pattern and leaflet.heat integration were guided by AI, but I implemented the backend date filtering, wired the toggle state through Map.jsx, and debugged z-index and styling issues myself.
```

---


## Sprint 16 — Map Page Restyle

```js
// [GenAI Use] Prompt:
// "Restyle the map page to use our design system tokens from Sprint 12. Replace all hardcoded colors and styles in PhotoUpload modal, MapViewToggle, and MapPin popups with CSS variables (var(--color-primary), var(--space-*), etc.) and shared classes (.btn, .btn-primary, .btn-outline, .card, .tag). Add a styled dropzone to the upload modal, make toggle buttons pill-shaped with orange active states, and override Leaflet popup styles to match the design system."

// [GenAI Use] LLM Response Start
// The LLM suggested CSS variable replacements, Leaflet popup override selectors, dropzone UI patterns with accessibility attributes, and button class mappings.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I used Claude Code to apply the design token replacements across multiple CSS files. I reviewed every edit to ensure the correct variables were used and no existing functionality broke. The Leaflet popup overrides required trial and error that I worked through with AI assistance.

// [GenAI Use] Ownership: 75%
//
// The token replacement was largely mechanical and AI-assisted, but I made all styling decisions (which tokens to use, spacing values, popup layout) and manually verified the visual output.
```

---

## Landing Page Redesign

```js
// [GenAI Use] Prompt:
// "Redesign the landing page. I want a split layout with a live interactive Leaflet map on the left third of the screen, a vertical divider, and the existing content (hero text, CTA buttons, feature cards) on the right. The map should use CartoDB Voyager tiles and be fully interactive. Make it responsive — stack vertically on mobile."

// [GenAI Use] LLM Response Start
// The LLM suggested a flex layout with sticky map panel, the InvalidateSize component pattern to fix Leaflet's gray tile issue when the container size isn't known at mount, and responsive breakpoints for mobile stacking.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// This went through several iterations. I started with a map background, then moved to a split layout, and refined it interactively with AI assistance. The InvalidateSize fix was critical — without it the map rendered gray tiles. I directed each iteration based on how it looked in the browser.

// [GenAI Use] Ownership: 60%
//
// AI generated the layout code and the InvalidateSize workaround, but I drove the design direction through multiple iterations, made all visual decisions, and debugged rendering issues by inspecting the result in-browser after each change.
```

---

## Test Generation (Multiple Sprints)

```js
// [GenAI Use] Prompt:
// "Write E2E tests for [sprint feature] following the patterns in test_sprint4_photos.py and conftest.py. Use pytest + requests, hit the running Express server, cover success and error cases, and use the shared auth fixtures."

// [GenAI Use] LLM Response Start
// The LLM generated pytest test suites matching existing conventions — using conftest fixtures, testing status codes, response shapes, and error handling for each endpoint.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// After writing the first two test files manually to establish patterns, I used AI to scaffold additional test suites for subsequent sprints. I reviewed each generated test, adjusted assertions where needed, and ran them against the live server to confirm they passed.

// [GenAI Use] Ownership: 60%
//
// Test generation was the area where I leaned most heavily on AI. The initial patterns were mine, but subsequent test files were largely AI-generated with my review and adjustments.
```

---

## Code Reviews (Sprints 14, 15)

```js
// [GenAI Use] Prompt:
// "Review this teammate's branch against the sprint spec. Check for design system compliance (correct CSS variables, shared classes), regressions to files outside the sprint scope, and any bugs or typos."

// [GenAI Use] LLM Response Start
// The LLM identified issues including out-of-scope file regressions, incorrect CSS variable names, missing base classes, invisible hover states, and indentation inconsistencies.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I used Claude Code to systematically diff teammate branches against main and the sprint spec. AI caught issues I might have missed in manual review (like a CSS variable that didn't exist). I verified each finding before applying fixes.

// [GenAI Use] Ownership: 80%
//
// AI was used as a review tool — I directed what to look for and verified all findings thoroughly. The fixes themselves were straightforward once the issues were identified (typos or small edge cases to handle).
```

---

# Amy Koski (am-one-y) - Authored Feature Disclosures

## Notes

Prompts below are reconstructed from memory as exact transcripts were not preserved. I mainly used the GPT-5 mini model to generate code. I thoroughly reviewed, tested, and adjusted all generated code before adding it, or wrote the code myself based on its suggestions.

## Overall Ownership Estimate

I feel ownership over approximately 75% of the code I personally committed.

I mainly used GenAI for styling, test generation, and implementation guidance. I reviewed all generated code, adjusted it as necessary, and made sure it followed project specifications before implementing it. GenAI was unnecessary for Sprint 1 and Sprint 14, as they had features I found easier to manually validate by implementing them myself.

## Sprint 1 Backend Setup

No GenAI was used for this sprint.

---

## Sprint 6 Photo Pinning on the Map

```js
// [GenAI Use] Prompt:
// "Create a simple modal that appears when the user clicks on the map that includes a file input for selecting a photo, text input for an optional caption, a display of the selected lat/lng (read-only), and a submit and cancel button, and style it according to the style of other pages."

// [GenAI Use] LLM Response Start
// The LLM created a component that included the requested features and created CSS styles for the modal and its sections.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// Each time I added a component to the modal or the map, I iteratively generated CSS styling that matched the current appearance. Once I wired the modal to the click logger and it was able to appear on screen, I validated and adjusted its appearance and function manually. 

// [GenAI Use] Ownership: 75%
//
// I used the base code for the modal to then add on, test, and debug features myself using useStates. AI was mainly used for styling and validating implementation approaches.
```

---

## Sprint 6 E2E Testing

```js
// [GenAI Use] Prompt:
// "Write E2E tests following the same patterns as test_sprint4_photos.py and conftest.py. Make tests covering that uploading a photo that returns a 201 exit code, that GET /api/photos returns the photo with correct location.lat and location.lng, that the imageUrl in the response starts with /uploads/, uploading multiple photos returns them sorted by createdAt in descending order, and that you can GET the image URL when uploading a photo."

// [GenAI Use] LLM Response Start
// The LLM generated pytest test cases covering the sprint features prompted, using the suggested patterns from conftest
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// The AI generated the test cases, and I then read over them to make sure their assertations were accurate and ran the code against the server to make sure they passed. When they didn't, I manually debugged the test cases' approaches to ensure they were actually recieving responses from the server.

// [GenAI Use] Ownership: 65%
//
// The AI generated initial tests, and I reviewed and adjusted the tests before committing.
```

---

## Sprint 14 Landing and Explore Page Restyle

No GenAI was used for this sprint.

