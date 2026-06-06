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

## echen078-Authored Feature Disclosures
### Notes

Some prompts below are reconstructed from memory because the exact original chat transcripts were not preserved. The descriptions are intended to accurately represent the type of assistance received and how the generated output was used.

For sprint-assigned work, I primarily followed the sprint instructions and used generative AI when I needed clarification about the requirements or did not know how to implement a specific step. I generally asked AI to implement the sprint tasks one step at a time while explaining: (1) the purpose of the step, (2) what the code was doing, and (3) how the change fit into the existing project. I reviewed each step, double-checked the output, and approved, rejected, or modified the implementation before committing it.

For additional features that were not directly part of a sprint, I made the design decisions about which features to add and how they should behave. When I was unsure about implementation details, I used AI in a planning role: I asked it for suggestions, tradeoffs, and clarifying questions, then made the final product and design decisions before asking it to help build the feature.

All generated code, suggestions, and documentation were reviewed, modified, tested, and integrated into the project before being committed.

### Overall Ownership Estimate

I feel ownership over approximately 75% of the code I personally committed.

Generative AI was primarily used for implementation guidance, debugging support, React/Express patterns, test generation, and documentation drafting. I reviewed all generated outputs, adapted them to the existing codebase, and verified behavior through manual testing and project requirements before committing changes.

For sprint work, my ownership comes from following the sprint specs, understanding each generated step through explanation, checking the implementation against the requirements, and deciding what to keep or change. For non-sprint features, my ownership is higher because I chose the feature direction and used AI mainly to help plan and implement the details after I made the design decisions.


### Sprint 3 Map Integration

```js
// [GenAI Use] Prompt:
// "Reconstructed/generalized prompt based on Sprint 3 instructions: Help me complete the frontend map integration sprint one step at a time. Explain the purpose of each step and what the code is doing. I need to use React Leaflet in a Vite React app, render a map centered on Los Angeles, create reusable map pins with popups, handle Leaflet CSS/default marker setup, and style the map so it displays correctly."

// [GenAI Use] LLM Response Start
// The LLM suggested using React Leaflet components such as MapContainer, TileLayer, Marker, Popup, and useMapEvents. It also suggested creating a reusable MapPin component, importing Leaflet CSS correctly, and styling the map container.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I followed the sprint requirements and used AI to clarify unfamiliar React Leaflet setup details. I reviewed each generated step, checked that it matched the sprint instructions, adapted the code to the existing project structure, and tested the map locally before committing.

// [GenAI Use] Ownership: 70%
//
// I feel ownership over approximately 70% of the map integration code I committed. AI provided guidance on React Leaflet usage and structure, but I integrated the components, adjusted styling and configuration, and verified functionality through testing.
```

---

### Sprint 8 Public Photos and Community Explore Feed

```js
// [GenAI Use] Prompt:
// "Reconstructed/generalized prompt based on Sprint 8 instructions: Help me implement the public photos and community feed sprint one step at a time. Explain what each backend and frontend change is for. I need public/private photo support, an optional auth path for public photo viewing, paginated public photo retrieval, an Explore page for browsing public photos, routing/navigation updates, and tests for the public/private access rules."

// [GenAI Use] LLM Response Start
// The LLM suggested public-photo routes, optional authentication, paginated API responses, React state management, and an Explore page UI for browsing public content.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I followed the sprint instructions and used AI to clarify the backend authorization flow and frontend pagination/state patterns. I reviewed the generated code carefully because this feature affected public/private access, integrated it with the existing API conventions, and manually verified the behavior.

// [GenAI Use] Ownership: 80%
//
// I feel ownership over approximately 80% of the public-photo/community-feed code I committed. AI assisted with implementation ideas, but I integrated the feature with the existing codebase and validated behavior myself.
```

---

### Sprint 8 Public Photo E2E Tests

```js
// [GenAI Use] Prompt:
// "Reconstructed/generalized prompt based on the Sprint 8 testing task: Help me write E2E tests for the public photos feature using the existing pytest fixtures. Explain the purpose of each test. Cover public upload behavior, default private behavior, public listing, pagination, public access without login, and private photo protection."

// [GenAI Use] LLM Response Start
// The LLM suggested pytest test cases covering authentication, uploads, public-photo retrieval, private-photo protection, and robust assertions.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I used the sprint testing requirements as the source of truth and asked AI to explain what each test proved. I reviewed the tests, adjusted brittle assertions, integrated them with the existing test suite, and confirmed that they exercised actual API behavior.

// [GenAI Use] Ownership: 65%
//
// I feel ownership over approximately 65% of the test code I committed. AI generated initial testing patterns, but I modified and validated the tests before submission.
```

---

### Public/Private Sharing Controls in Upload and Photo Detail

```js
// [GenAI Use] Prompt:
// "Reconstructed/generalized planning prompt: I want to improve Momento by making public/private sharing clearer across upload and photo detail views. Help me think through the UX and implementation options. Users should be able to choose whether a photo is public, owners should be able to edit visibility, and the UI should clearly show public/private status. Ask clarifying questions if needed before implementation."

// [GenAI Use] LLM Response Start
// The LLM suggested passing an isPublic field through upload forms, updating visibility through API routes, displaying public/private badges, and restricting edit controls to owners.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// This was an additional design decision I made beyond simply following a sprint checklist. I used AI to help flesh out implementation details, but I decided that visibility controls and badges should exist, reviewed the suggested approach, and verified authorization behavior and owner-only controls.

// [GenAI Use] Ownership: 85%
//
// I feel ownership over approximately 85% of this feature. AI suggested a general implementation approach, but I adapted it to the project architecture and verified final behavior.
```

---

### Upload and Image Handling Improvements

```js
// [GenAI Use] Prompt:
// "Reconstructed/generalized planning prompt: I want to improve Momento's upload experience because users may upload phone photos and confusing upload failures are hard to debug. Help me plan and implement support for common image formats, safer upload directory handling, image normalization when possible, and clearer upload error messages. Explain each step before changing it."

// [GenAI Use] LLM Response Start
// The LLM suggested expanding upload validation, ensuring upload directories exist, improving error handling, and supporting additional image formats.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I chose this improvement because it made the app more usable outside the base sprint requirements. I used AI to suggest implementation options and explain unfamiliar upload/image-handling details, then kept the approach that fit the existing upload pipeline and verified expected upload scenarios.

// [GenAI Use] Ownership: 70%
//
// I feel ownership over approximately 70% of these changes. AI suggested approaches, while I adapted them to the project's existing upload architecture and tested the final implementation.
```

---

### Sprint 15 Gallery, Photo Detail & Search Restyle

```js
// [GenAI Use] Prompt:
// "Reconstructed/generalized prompt based on Sprint 15 instructions: Help me restyle the gallery, search, photo detail, modal, and tag input features using the shared design system. Work step by step and explain each change. Preserve existing behavior like tag filtering, URL tag sync, delete/edit flows, and owner controls while improving layout, empty states, badges, and responsive styling."

// [GenAI Use] LLM Response Start
// The LLM suggested React state-management patterns, filter handling, UI improvements, modal editing flows, and responsive layout refinements.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I followed the sprint restyle requirements while using AI to explain how to apply the design-system tokens and avoid logic regressions. I reviewed the generated changes, adjusted the styling to match the app, and manually tested gallery/search/photo-detail interactions.

// [GenAI Use] Ownership: 85%
//
// I feel ownership over approximately 85% of this work. AI provided implementation suggestions, but I integrated them into the existing application and verified functionality.
```

---

### Explore Revamp, Likes, and View-on-Map Flow

```js
// [GenAI Use] Prompt:
// "Reconstructed/generalized planning prompt: I want to add extra community and navigation features to Momento beyond the sprint requirements. Help me plan how likes, 'mine' labels, owner edit actions, and a View on Map flow should work. Give implementation suggestions and ask clarifying questions so I can decide the final behavior before building."

// [GenAI Use] LLM Response Start
// The LLM suggested backend support for likes, frontend state management, conditional rendering for owner actions, and navigation between photo details and the map.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// These were additional feature/design decisions I made to make the community experience more useful. I used AI in planning mode to discuss implementation options, made the final decisions about behavior, then reviewed the generated backend/frontend changes and validated the user experience before committing.

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

---

# Anthony Navarrez (AnthonyNavarrez) - Authored Feature Disclosures

## Notes

Prompts below are reconstructed from memory as exact transcripts were not preserved. I used Claude Code (CLI) as my primary GenAI tool throughout the project. My workflow was to draft an idea of how to tackle a feature my self and provide pseudocode, I then explicitly prompted to not reveal a full answer, I asked to evluate my apporach for weak spots and compare it with best practice. I also asked for general syntax help. 

## Overall Ownership Estimate

I feel ownership over approximately 75% of the code I personally committed.

Generative AI was primarily used for evaluating and refactoring my original approaches, providing boilerplate code, generating tests from existing patterns, and debugging. I explicitly ask to not reveal a full answer but instead ask me questions to guide me on a better trajectory.

---

## Sprint 5 Frontend layout routing

```js
// [GenAI Use] Prompt:
// I need to set up the frontend for Momento. I need an Axios instance with a request  interceptor that attaches a JWT token from localStorage to every outgoing request. I also need a React Context that provides shared auth state (user, token, loading) with login() and logout() functions, and on mount validates any stored token by calling GET /api/auth/me. I need a ProtectedRoute component that redirects unauthenticated  users, a Navbar that conditionally renders based on auth state, and React Router wiring in App.jsx would i approach this like ... , dont reveal the full implementation

// [GenAI Use] LLM Response Start
// The LLM suggested an Axios instance with a request interceptor reading from localStorage, an AuthProvider using createContext and useEffect for token validation on mount, login and logout functions managing both localStorage and React state, a ProtectedRoute using Navigate from React Router, and a Navbar consuming useAuth to conditionally render links.
// [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I reviewed the generated AuthContext carefully and caught that the loading state was being set to false immediately on mount before the async token validation completed, which would have caused a flash of unauthenticated content on every refresh. I corrected the initialization to loading: true and ensured setLoading(false) was only called after the GET /api/auth/me request settled in both the then and catch branches

// [GenAI Use] Ownership: 80%
//
// The AI reaffired some of my ideas but also redirected me towards better approaches and helped me with boilderplate + syntax
```

---

## sprint 10 Search Filtering landing

```js
// [GenAi Use] Prompt:
// Write a pytest E2E test file for the GET /api/photos/search endpoint following the same pattern as tests/test_sprint4_photos.py. the tests should cover search by caption text, search by tag text, filter by single tag, filter by multiple comma-separated tags, search with no results, date range filter, pagination, and auth required

// [GenAI Use] LLM Response Start
// The LLM generated a TestSearchPhotos class with a reusable _upload helper method that creates a minimal valid JPEG and posts it to the API, eight test functions each targeting a specific filter case, strong per-photo assertions on tag filters, boundary condition tests for no results and auth enforcement, and pytest fixture injection for base_url and auth_header. [GenAI Use] LLM Response End

// [GenAI Use] Reflection:
// I reviewed each test case against the sprint spec to verify they were an adequate specification of the problem. The generated tests covered the individual filter cases well but I accepted them without thinking through every edge case myself. I did not add a test for combined filters sent simultaneously, which now I realize allows for future changes to possibly pass the test suite 

// [GenAI Use] Ownership: 50%
//
// The AI generated the tests based on the cases i orginilly provided, and I reviewed and adjusted the tests before committing.
```

---

## Sprint 12 design system navbar

AI was mainly used for general CSS syntax questions

---