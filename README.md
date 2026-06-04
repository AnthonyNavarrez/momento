# Momento

Momento is a photo-centric mapping app for Los Angeles. Users upload photos, pin them to map locations, and build a visual record of their exploration. A community heatmap aggregates public activity so users can discover where people are actually going.

## Features

- **Interactive map** — Leaflet map (CartoDB Voyager tiles) centered on LA with click-to-pin photo uploads
- **Photo uploads** — Multipart upload with JPEG/PNG/HEIC support, automatic image normalization
- **Authentication** — JWT-based signup/login with protected routes and persistent sessions
- **Personal gallery** — Browse your photos in a responsive grid with search, tag filtering, and date ranges
- **Community explore** — Paginated public photo feed with broken-image placeholders
- **Community heatmap** — Aggregated density overlay of public photos with week/month/year/all-time toggles
- **Tagging system** — Add/remove tags, suggested tags, clickable tag filters synced to URL params
- **Photo detail** — View/edit caption, tags, and public/private visibility; owner-only delete
- **Design system** — CSS custom properties for colors, spacing, typography, and shared component classes
- **Search & filter** — Full-text caption search, multi-tag filtering, date range filtering with debounced input

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, React Router 7, React Leaflet, Axios |
| Backend | Express 5, Node.js |
| Database | MongoDB Atlas via Mongoose 9 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File uploads | Multer (disk storage), Sharp (image processing) |
| Map tiles | CartoDB Voyager (via CARTO CDN) |
| Testing | pytest + requests (E2E) |

## Getting Started

### Prerequisites

#### MongoDB Atlas Credentials

This project uses MongoDB Atlas as its database. To get your credentials:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to the **momento-prod** cluster
3. Go to **Database Access** in the left sidebar to find your username and password
4. If you don't have a database user yet, ask a team member with admin access to create one for you

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

- **Important:** Use `PORT=5001` (not 5000). On macOS, port 5000 is used by AirPlay Receiver and will cause 403 errors. The Vite proxy in `vite.config.js` is configured to forward `/api` requests to `localhost:5001`.
- Set `MONGO_URI` to your Atlas connection string with your database username and password filled in
- Set `JWT_SECRET` to a random string (you can generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

Then start the server:

```bash
npm run dev
```

### Frontend Setup

From the project root:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account, returns JWT |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Current user profile |
| POST | `/api/photos` | Yes | Upload photo (multipart, field: `photo`) |
| GET | `/api/photos` | Yes | User's photos |
| GET | `/api/photos/public` | No | Paginated public photos |
| GET | `/api/photos/search` | Yes | Search by caption, tags, date range |
| GET | `/api/photos/heatmap` | No | Heatmap points with period filter |
| GET | `/api/photos/:id` | Optional | Single photo (owner or public) |
| PUT | `/api/photos/:id` | Yes | Update caption, tags, visibility |
| DELETE | `/api/photos/:id` | Yes | Delete photo (owner only) |

## Testing

E2E tests use **pytest** and hit the running Express server over HTTP.

```bash
# Install test dependencies (one-time)
cd tests
pip install -r requirements.txt

# Run tests (backend must be running on port 5001)
pytest -v
```

Test files follow the pattern `tests/test_sprint<N>_<feature>.py`. Shared fixtures (base URL, auth helpers) are in `tests/conftest.py`.

## Project Structure

```
momento/
├── src/                          # React frontend (Vite)
│   ├── api/axios.js              # Axios instance with JWT interceptor
│   ├── context/AuthContext.jsx   # Auth state provider
│   ├── components/
│   │   ├── Navbar.jsx            # Auth-aware navigation
│   │   ├── SearchBar.jsx         # Multi-criteria search with filter chips
│   │   ├── TagInput.jsx          # Tag management with suggestions
│   │   ├── PhotoUpload.jsx       # Upload modal with dropzone
│   │   ├── PhotoDetailModal.jsx  # Lightbox photo viewer
│   │   └── Map/
│   │       ├── Map.jsx           # Main map with pins + heatmap
│   │       ├── MapPin.jsx        # Marker with styled popup
│   │       ├── MapViewToggle.jsx # My Photos / Heatmap switch
│   │       └── HeatmapLayer.jsx  # Heat density overlay
│   └── pages/
│       ├── LandingPage.jsx       # Split layout with live map
│       ├── LoginPage.jsx         # Login form
│       ├── signup.jsx            # Registration form
│       ├── Map.jsx               # Map page wrapper
│       ├── GalleryPage.jsx       # Personal photo gallery
│       ├── ExplorePage.jsx       # Public community feed
│       └── PhotoDetailPage.jsx   # Single photo view/edit
├── server/                       # Express backend (CommonJS)
│   ├── index.js                  # App entry, mounts routes
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── upload.js             # Multer config (JPEG/PNG/HEIC, 10MB)
│   │   └── imageProcessing.js   # Sharp-based normalization
│   ├── models/
│   │   ├── User.js               # username, email, password (hashed)
│   │   └── Photo.js              # user, imageUrl, location, caption, tags, isPublic
│   ├── controllers/
│   │   ├── authController.js     # register, login, getMe
│   │   └── photoController.js    # CRUD + search + heatmap
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── photoRoutes.js        # Photo endpoints
│   └── middleware/auth.js        # JWT verification
├── tests/                        # E2E tests (pytest + requests)
└── sprints/                      # Sprint specs with task breakdowns
```

## Team Contributions

| Sprint | Feature | Contributor |
|--------|---------|-------------|
| 1 | Backend Setup | Amy |
| 2 | User Authentication | Ho Lok |
| 3 | Frontend Map Integration | Ellen |
| 4 | Photo Upload API | Gokul |
| 5 | Frontend Layout & Routing | Anthony |
| 6 | Photo Pinning on Map | Ho Lok |
| 7 | Photo Detail & Gallery | Anthony |
| 8 | Public Photos & Community Feed | Ellen |
| 9 | Community Heatmap | Gokul |
| 10 | Search & Filtering | Amy |
| 11 | Integration Wiring | Gokul |
| 12 | Design System & Navbar | Anthony |
| 13 | Login & Signup Restyle | Ho Lok |
| 14 | Landing & Explore Restyle | Amy |
| 15 | Gallery, Photo Detail & Search Restyle | Ellen |
| 16 | Map Page Restyle | Gokul |
