# Sprint 2: User Authentication (Signup & Login API)

**Assignee:** TBD
**Goal:** Build the backend authentication system so users can register, log in, and have their identity verified on protected routes.
**Dependencies:** Sprint 1 must be complete (backend server & MongoDB must be running)

---

## Background (read this first)

**Authentication** is how we verify "who is this user?" Here's how it works at a high level:

1. User signs up → we store their info in the database with a **hashed password** (we never store plain text passwords)
2. User logs in → we check their password against the hash. If it matches, we give them a **JWT token**
3. On future requests, the user sends that token in the header → we verify it and know who they are

**Key concepts:**
- **Hashing** — a one-way transformation. We hash the password before storing it. When the user logs in, we hash what they typed and compare. Even if someone steals the database, they can't reverse the hash to get passwords.
- **JWT (JSON Web Token)** — a signed string that contains the user's ID. It's like a temporary ID card the server issues. The server can verify it's real without checking the database every time.
- **Middleware** — a function that runs *before* your route handler. Our auth middleware will check the JWT and block unauthorized requests.

**Useful resources:**
- [bcryptjs npm page](https://www.npmjs.com/package/bcryptjs) — look at the usage examples
- [jsonwebtoken npm page](https://www.npmjs.com/package/jsonwebtoken) — look at `jwt.sign()` and `jwt.verify()`
- [Mongoose model docs](https://mongoosejs.com/docs/models.html)
- Search for "Express JWT authentication tutorial" for full walkthroughs

---

## Tasks

### 1. Install auth dependencies

- [ ] In the `server/` directory, install `bcryptjs` (for password hashing) and `jsonwebtoken` (for creating/verifying tokens)

### 2. Add JWT_SECRET to environment variables

- [ ] Add a `JWT_SECRET` variable to your `.env` file — this can be any long random string. It's the key used to sign tokens.
- [ ] Update `.env.example` with a placeholder so teammates know they need this

### 3. Create the User model

- [ ] Create `server/models/User.js`
- [ ] Define a Mongoose schema with these fields:
  - `username` — String, required, must be unique, trimmed of whitespace
  - `email` — String, required, must be unique, stored as lowercase
  - `password` — String, required (this will store the hashed version, not the plain text)
  - `createdAt` — Date, defaults to the current time
- [ ] Export the model
  > Look up "mongoose schema" in the docs. The `unique: true` and `lowercase: true` options are built into Mongoose schema types.

### 4. Create the auth controller

- [ ] Create `server/controllers/authController.js`
- [ ] Build a **register** function:
  - Accept `username`, `email`, and `password` from the request body
  - Check if a user with that email or username already exists — if so, return a `400` error
  - Hash the password using bcryptjs (use 10 salt rounds — look up `bcrypt.genSalt()` and `bcrypt.hash()`)
  - Save the new user to MongoDB
  - Generate a JWT token containing the user's ID (look up `jwt.sign()` — use your JWT_SECRET from the env, and set an expiration like `'7d'`)
  - Return the token and user info (but do NOT include the password in the response)
- [ ] Build a **login** function:
  - Find the user by email
  - If no user found, return `401` with "Invalid credentials"
  - Compare the submitted password against the stored hash (look up `bcrypt.compare()`)
  - If it matches → generate and return a JWT + user info
  - If it doesn't match → return `401` with "Invalid credentials"
  > **Why the same error for wrong email and wrong password?** Security best practice — we don't reveal whether an email exists in our system.

### 5. Create auth routes

- [ ] Create `server/routes/authRoutes.js`
- [ ] Define two routes:
  - `POST /api/auth/register` → calls the register function
  - `POST /api/auth/login` → calls the login function
- [ ] Mount these routes in `server/index.js` using `app.use()`
  > Look up the Express Router docs — you create a router, define routes on it, and then mount it with a prefix like `/api/auth`.

### 6. Create the auth middleware

- [ ] Create `server/middleware/auth.js`
- [ ] This should be a function that:
  - Looks for a token in the request's `Authorization` header (the format is `Bearer <token>`)
  - If no header/token exists → return `401` ("No token, authorization denied")
  - Verifies the token using `jwt.verify()` with your JWT_SECRET
  - If valid → attach the decoded user ID to the request object (e.g., `req.user = { id: decoded.id }`) and call `next()` to let the request continue
  - If invalid → return `401` ("Token is not valid")
- [ ] Export this middleware so other sprints can use it

### 7. Create a protected test route

- [ ] Add a `GET /api/auth/me` route in your auth routes file
- [ ] Protect it with the auth middleware (pass the middleware function before the route handler)
- [ ] The handler should look up the user in the database using `req.user.id` and return their info (excluding the password)
  > In Mongoose, you can exclude fields from a query using `.select('-password')`.

### 8. Test everything manually

Use **Postman**, **Thunder Client** (VS Code extension), or **curl** to test each scenario:

- [ ] Register a new user → expect `201` status + token + user info
- [ ] Register with the same email again → expect `400` error
- [ ] Login with correct credentials → expect `200` + token
- [ ] Login with wrong password → expect `401` + "Invalid credentials"
- [ ] Call `GET /api/auth/me` with a valid token in the Authorization header → expect user info
- [ ] Call `GET /api/auth/me` without a token → expect `401`

---

## Deliverables Checklist

- [ ] `POST /api/auth/register` — creates a user and returns a JWT
- [ ] `POST /api/auth/login` — validates credentials and returns a JWT
- [ ] `GET /api/auth/me` — returns current user info when given a valid token
- [ ] Auth middleware exported and reusable for other routes
- [ ] Passwords are hashed (never stored as plain text)
- [ ] All 6 manual test cases pass
