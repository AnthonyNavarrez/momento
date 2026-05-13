# Sprint 5: Frontend Layout, Routing & Auth Pages

**Assignee:** TBD
**Goal:** Set up React Router, create the app's page structure, and build the login/signup UI that connects to the auth API.
**Dependencies:** Sprint 2 (auth API) must be complete to test the forms end-to-end. You can build the UI first and test against the API once it's ready.

---

## Background (read this first)

Right now the frontend is a single page (`App.jsx`). We need to add **routing** so different URLs show different pages (like `/login`, `/signup`, `/map`). We also need a way to manage the logged-in user's state across the whole app.

**Key concepts:**
- **React Router** — a library that lets you map URLs to components. When the user visits `/login`, it renders `LoginPage`. When they visit `/map`, it renders `MapPage`. No full page reload — it swaps components in and out.
- **Context API** — React's built-in way to share state across many components without passing props down through every level. We'll use it to share the current user's info and login/logout functions app-wide.
- **localStorage** — browser storage that persists across page refreshes and tab closes. We store the JWT token here so the user stays logged in.
- **Axios** — an HTTP client library (alternative to `fetch`). Its main advantage for us is **interceptors** — functions that run before every request, so we can automatically attach the JWT token.
- **Protected routes** — some pages (like the map) should only be accessible to logged-in users. If someone tries to visit `/map` without being logged in, we redirect them to `/login`.

**Useful resources:**
- [React Router tutorial](https://reactrouter.com/en/main/start/tutorial)
- [React Context docs](https://react.dev/reference/react/createContext)
- [Axios docs](https://axios-http.com/docs/intro) — look at "Creating an Instance" and "Interceptors"
- Search for "react protected routes tutorial" for pattern examples

---

## Tasks

### 1. Install frontend dependencies

- [ ] In the `momento/` directory, install `react-router-dom` and `axios`

### 2. Set up the Axios instance

- [ ] Create `src/api/axios.js`
- [ ] Create a reusable axios instance with the `baseURL` pointing to your backend (`http://localhost:5001/api`)
- [ ] Add a **request interceptor** that checks localStorage for a token and, if found, attaches it to the request's `Authorization` header in the format `Bearer <token>`
  > Look up "axios create instance" and "axios interceptors" in the docs. The interceptor runs automatically before every request, so you don't have to manually add the token each time.

### 3. (Optional but recommended) Set up Vite proxy

- [ ] In `vite.config.js`, add a dev server proxy so that requests to `/api` get forwarded to `http://localhost:5001`
- [ ] If you set this up, update your axios `baseURL` to just `'/api'` instead of the full localhost URL
  > This avoids CORS issues during development. Look up "vite server proxy" in the Vite docs.

### 4. Create the Auth Context

- [ ] Create `src/context/AuthContext.jsx`
- [ ] Use React's `createContext` and a provider component to share auth state
- [ ] The context should provide:
  - `user` — the current user object, or `null` if logged out
  - `token` — the JWT string, or `null`
  - `login(token, userData)` — a function that stores the token in localStorage and updates state
  - `logout()` — a function that clears the token from localStorage and resets state to null
  - `loading` — a boolean that's `true` while we're checking if a stored token is still valid
- [ ] On app load (use `useEffect`), check if there's a token in localStorage. If so, call `GET /api/auth/me` to verify it's still valid and load the user data. If the request fails, clear the token.
- [ ] Create and export a custom hook (e.g., `useAuth()`) that wraps `useContext` so other components can easily access auth state
  > The `loading` state is important — without it, the app would briefly redirect to the login page on every refresh before the token verification completes.

### 5. Create the page components

**LoginPage (`src/pages/LoginPage.jsx`):**
- [ ] Build a form with `email` and `password` fields
- [ ] Use `useState` to track the form input values
- [ ] On submit, send a POST request to `/auth/login` using your axios instance
- [ ] If successful, call the `login()` function from your auth context and redirect to `/map`
- [ ] If error, display the error message below the form (e.g., "Invalid credentials")
- [ ] Add a link at the bottom: "Don't have an account? Sign up" that navigates to `/signup`
  > Look up `useNavigate` from React Router for programmatic navigation after login.

**SignupPage (`src/pages/SignupPage.jsx`):**
- [ ] Build a form with `username`, `email`, and `password` fields
- [ ] On submit, POST to `/auth/register`
- [ ] If successful, call `login()` from context and redirect to `/map`
- [ ] If error (e.g., email already taken), display the error message
- [ ] Add a link: "Already have an account? Log in" navigating to `/login`

**MapPage (`src/pages/MapPage.jsx`):**
- [ ] For now, just render a simple placeholder like "Welcome to the map!"
- [ ] This page will eventually import the Map component from Sprint 3

### 6. Create the ProtectedRoute component

- [ ] Create `src/components/ProtectedRoute.jsx`
- [ ] This component should check the auth context:
  - If `loading` is true → show a simple loading indicator
  - If no user is logged in → redirect to `/login` (look up the `Navigate` component from React Router)
  - If user is logged in → render the child content
- [ ] This will be used to wrap routes that require authentication

### 7. Build the Navbar

- [ ] Create `src/components/Navbar.jsx`
- [ ] Use the auth context to check if a user is logged in
- [ ] When logged out → show the app name ("Momento") and links to Login and Signup
- [ ] When logged in → show the app name, the username, and a Logout button
- [ ] The Logout button should call `logout()` from context and navigate to `/login`
  > Use `<Link>` from React Router for navigation links (not plain `<a>` tags — those cause full page reloads).

### 8. Wire up the routes in App.jsx

- [ ] Rewrite `App.jsx` to set up routing
- [ ] Wrap everything in `BrowserRouter` and your `AuthProvider`
- [ ] Add the Navbar (visible on all pages)
- [ ] Define these routes:
  - `/` → redirects to `/map`
  - `/login` → renders LoginPage
  - `/signup` → renders SignupPage
  - `/map` → renders MapPage, wrapped in ProtectedRoute
  > Look up `Routes`, `Route`, and `Navigate` in the React Router docs.

### 9. Test the full flow

- [ ] Start both the backend and frontend dev servers
- [ ] Go to `/signup` → create a new account → confirm you're redirected to `/map`
- [ ] Refresh the page → confirm you're still logged in (token persists in localStorage)
- [ ] Click Logout → confirm you're redirected to `/login`
- [ ] Try visiting `/map` while logged out → confirm you're redirected to `/login`
- [ ] Go to `/login` → log in with your credentials → confirm you reach the map page
- [ ] Check the Navbar updates correctly (shows Login/Signup when logged out, username/Logout when logged in)

---

## Deliverables Checklist

- [ ] Signup form creates an account and logs in automatically
- [ ] Login form authenticates and redirects to the map
- [ ] JWT token is stored in localStorage and attached to all API requests
- [ ] Protected route redirects unauthenticated users to `/login`
- [ ] Navbar shows Login/Signup when logged out, username/Logout when logged in
- [ ] Page refresh doesn't lose the login state
- [ ] Auth context is accessible from any component via the custom hook

## File Structure

```
src/
├── api/
│   └── axios.js
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   └── MapPage.jsx
└── App.jsx
```
