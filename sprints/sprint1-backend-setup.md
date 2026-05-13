# Sprint 1: Backend Server & Database Setup

**Assignee:** TBD
**Goal:** Stand up the Express.js backend server and connect it to MongoDB so the rest of the team has an API foundation to build on.
**Dependencies:** None — can start immediately

---

## Background (read this first)

The **backend** is the part of the app that runs on a server (not in the browser). It handles things like saving data to a database, processing requests, and sending responses back to the frontend. We're using:

- **Express.js** — a lightweight framework for building web servers in Node.js. Think of it as the thing that listens for HTTP requests (like `GET /api/health`) and sends back responses.
- **MongoDB** — a database that stores data as JSON-like documents (instead of tables/rows like SQL). We use it through **Mongoose**, a library that gives us a nice way to define data shapes ("schemas") and interact with MongoDB.
- **dotenv** — lets us store secrets (like database passwords) in a `.env` file that doesn't get committed to git.

**Useful resources:**
- [Express "Hello World" guide](https://expressjs.com/en/starter/hello-world.html)
- [Mongoose getting started](https://mongoosejs.com/docs/)
- [MongoDB Atlas setup guide](https://www.mongodb.com/docs/atlas/getting-started/)

---

## Tasks

### 1. Initialize the backend project

- [ ] Create a `server/` directory at the project root
- [ ] Initialize a new Node.js project inside it using `npm init`
- [ ] Install these runtime dependencies: `express`, `mongoose`, `dotenv`, `cors`
- [ ] Install `nodemon` as a dev dependency (it auto-restarts the server when you change files)

### 2. Create the folder structure

- [ ] Inside `server/`, create these empty folders that the other sprints will use:
  - `config/` — database connection setup
  - `models/` — Mongoose schemas (data shapes)
  - `routes/` — URL endpoint definitions
  - `controllers/` — request handler logic
  - `middleware/` — functions that run before route handlers

### 3. Create the Express server entry point

- [ ] Create `server/index.js`
- [ ] Set up a basic Express app that does the following:
  - Loads environment variables from `.env` using dotenv
  - Enables CORS middleware (so the frontend can talk to this server)
  - Parses incoming JSON request bodies
  - Listens on a port from the environment variable `PORT`, defaulting to `5001`
- [ ] Add a health-check route: `GET /api/health` that returns `{ status: "ok" }`
  > This is a simple route that lets us verify the server is running. Look up the Express docs on `app.get()` and `res.json()`.
- [ ] Test it by running the server and visiting `http://localhost:5001/api/health` in your browser

### 4. Connect to MongoDB

- [ ] Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account and cluster
- [ ] In the Atlas dashboard, get your connection string (click "Connect" → "Connect your application")
- [ ] Create a `.env` file in the `server/` directory with two variables: `PORT` and `MONGO_URI`
- [ ] Create `server/config/db.js` — this file should export a function that uses Mongoose to connect to the URI from the environment variable
  > Look up `mongoose.connect()` in the Mongoose docs. Wrap it in a try/catch and log whether the connection succeeded or failed.
- [ ] Call your connection function in `index.js` when the server starts up
- [ ] Verify you see a success message when the server starts

### 5. Set up environment variable safety

- [ ] Add `.env` to `server/.gitignore` so secrets don't get pushed to GitHub
- [ ] Create a `.env.example` file that lists the variable names with placeholder values (this IS safe to commit — it tells teammates what variables they need to set up)

### 6. Add npm scripts

- [ ] In `server/package.json`, add two scripts:
  - A `dev` script that runs the server with nodemon (for development — auto-restarts on changes)
  - A `start` script that runs the server with plain node (for production)

### 7. Verify everything works

- [ ] Run the dev script and confirm you see the MongoDB success message in the terminal
- [ ] Open `http://localhost:5001/api/health` and confirm you see `{"status":"ok"}`
- [ ] Run `git status` and confirm `.env` is NOT listed (it should be gitignored)

---

## Deliverables Checklist

- [ ] Express server runs on `localhost:5001`
- [ ] MongoDB connects successfully on startup
- [ ] `GET /api/health` returns `{ status: "ok" }`
- [ ] `.env` is git-ignored; `.env.example` exists for teammates
- [ ] Folder structure is clean and ready for other sprints
