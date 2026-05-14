# CLAUDE.md — Momento Codebase Guide

## Project Summary

Momento is a photo-centric mapping app for Los Angeles. Users upload photos, pin them to map locations, and build a visual record of their exploration. A community heatmap aggregates public activity so users can discover where people are actually going.

## Architecture

Monorepo with React frontend at root and Express backend in `server/`.

```
momento/
├── src/                          # React frontend (Vite, ES modules)
│   ├── main.jsx                  # Entry point, Leaflet CSS + icon fix
│   ├── App.jsx                   # Root component with React Router
│   ├── api/
│   │   └── axios.js              # Axios instance, JWT interceptor, baseURL: '/api'
│   ├── components/
│   │   ├── Navbar.jsx            # Auth-aware nav bar
│   │   ├── ProtectedRoute.jsx    # Redirects to /login if unauthenticated
│   │   └── Map/
│   │       ├── Map.jsx           # MapContainer centered on LA (34.0522, -118.2437)
│   │       ├── MapPin.jsx        # Reusable Marker + Popup
│   │       └── Map.css
│   ├── context/
│   │   └── AuthContext.jsx       # Provides user, token, login(), logout(), loading
│   └── pages/
│       ├── LoginPage.jsx         # Email/password login
│       ├── signup.jsx            # Username/email/password registration
│       └── Map.jsx               # Map page (placeholder)
├── server/                       # Express backend (CommonJS)
│   ├── index.js                  # App entry, mounts routes at /api/auth, /api/photos
│   ├── config/
│   │   ├── db.js                 # mongoose.connect(MONGO_URI)
│   │   └── upload.js             # Multer disk storage (JPEG/PNG/HEIC, 10MB limit)
│   ├── models/
│   │   ├── User.js               # username, email, password (hashed), createdAt
│   │   └── Photo.js              # user (ref), imageUrl, location {lat,lng}, caption, tags, isPublic, createdAt
│   ├── controllers/
│   │   ├── authController.js     # register, login, getMe
│   │   └── photoController.js    # uploadPhoto, getUserPhotos, getPhotoById, deletePhoto
│   ├── routes/
│   │   ├── authRoutes.js         # POST /register, POST /login, GET /me
│   │   └── photoRoutes.js        # POST /, GET /, GET /:id, DELETE /:id
│   ├── middleware/
│   │   └── auth.js               # JWT verification → req.user = { id }
│   └── uploads/                  # Local file storage (gitignored)
└── sprints/                      # Sprint specs with task breakdowns
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, React Router 7, Axios |
| Mapping | Leaflet + React Leaflet |
| Backend | Express 5, Node.js |
| Database | MongoDB Atlas via Mongoose 9 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File uploads | Multer (disk storage) |

## Commands

```bash
# Install & run frontend (from project root)
npm install
npm run dev          # Vite dev server on port 5173

# Install & run backend
cd server && npm install
npm run dev          # Nodemon on port 5001

# Lint frontend
npm run lint
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account → returns JWT |
| POST | `/api/auth/login` | No | Login → returns JWT |
| GET | `/api/auth/me` | Yes | Current user profile |
| POST | `/api/photos` | Yes | Upload photo (multipart, field: 'photo') |
| GET | `/api/photos` | Yes | User's photos (sorted by createdAt desc) |
| GET | `/api/photos/:id` | Yes | Single photo (owner or public) |
| DELETE | `/api/photos/:id` | Yes | Delete photo (owner only) |

Auth uses `Authorization: Bearer <token>` header. The `protect` middleware in `server/middleware/auth.js` verifies it.

## Environment Variables

Backend requires `server/.env`:
```
PORT=5001
MONGO_URI=mongodb+srv://<user>:<pass>@momento-prod.4mkxecn.mongodb.net/?appName=momento-prod
JWT_SECRET=<random-string>
```

Frontend has no env vars. Vite proxies `/api` requests to `http://localhost:5000` (see `vite.config.js`).

## Key Patterns & Conventions

- **Module systems**: Frontend uses ES modules (`import`/`export`). Backend uses CommonJS (`require`/`module.exports`).
- **File organization**: Frontend groups by feature (`components/Map/`). Backend follows MVC (`models/`, `controllers/`, `routes/`).
- **Styling**: Plain CSS files co-located with components. No CSS framework.
- **Auth flow**: Register/login returns JWT → stored in localStorage → attached to requests via axios interceptor → verified by `protect` middleware → `req.user.id` available in controllers.
- **Error handling**: Controllers use try/catch, return appropriate HTTP status codes (400, 401, 403, 404, 500).
- **Protected routes (frontend)**: Wrap with `<ProtectedRoute>` component which checks AuthContext.
- **Protected routes (backend)**: Add `protect` middleware before controller in route definition.
- **Photo uploads**: Multipart form data with field name `'photo'`. Files stored in `server/uploads/` with timestamped names. Served statically at `/uploads/`.

## Database Schemas

**User**: `{ username, email, password (bcrypt), createdAt }`
**Photo**: `{ user (ObjectId ref), imageUrl, location: { lat, lng }, caption, tags: [String], isPublic (default: false), createdAt }`

## What's Built vs. What's Next

**Completed**: Server setup, user auth, map integration, photo upload API, frontend routing & auth pages.

**Not yet built**:
- Personal heatmap (exploration density overlay)
- Community heatmap (aggregated public photos, weekly/monthly/yearly toggles)
- Browse public photos on map by tapping heatmap zones
- Photo tagging & search/filter
- UI polish & performance optimization

## Sprint Docs

Detailed implementation specs are in `sprints/`. Check the relevant sprint file before building a feature:
- `sprint1-backend-setup.md`
- `sprint2-user-auth.md`
- `sprint3-map-integration.md`
- `sprint4-photo-upload-api.md`
- `sprint5-frontend-layout-routing.md`
