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

The frontend lives at the project root 

```bash
# From the project root
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
