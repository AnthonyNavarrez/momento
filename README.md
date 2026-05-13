# Momento

Momento is a photo-centric mapping application that helps users turn their memories into a visual exploration journal of Los Angeles. Users can upload photos, pin them to map locations, and revisit places they’ve explored through an interactive map experience.

## Features

- User authentication (signup/login)
- Interactive Los Angeles map with React Leaflet
- Photo uploads with location pinning
- Map markers with popup previews
- Protected routes and persistent login sessions
- MongoDB-backed backend API

## Tech Stack

### Frontend
- React
- Vite
- React Router
- React Leaflet
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer


## Getting Started

### Backend Setup

```bash
cd server
npm install
npm run dev
```

Create a `.env` file inside `server/`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Team Contributions

| Sprint | Contributor |
|---|---|
| Backend Setup | Amy |
| User Authentication | Ho Lok |
| Frontend Map Integration | Ellen |
| Photo Upload API | Gokul |
| Frontend Layout & Routing | Anthony |

## Current Progress

Completed functionality includes:
- Backend server and database setup
- JWT-based authentication system
- Interactive map integration
- Photo upload API and storage
- Frontend routing and auth pages

## Planned Features

- Personal exploration heatmaps
- Community discovery heatmaps
- Public photo browsing
- Photo tagging and filtering
- Search by location, date, or tags
- Timeline and collection views

## Inspiration

Momento was created to help users organize memories geographically while also enabling authentic local discovery through community-shared experiences.
