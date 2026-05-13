# Sprint 4: Photo Upload API & Storage

**Assignee:** TBD
**Goal:** Build the backend API for uploading, storing, and retrieving photos with location data.
**Dependencies:** Sprint 1 (server & DB) and Sprint 2 (auth middleware) must be complete

---

## Background (read this first)

This sprint adds the core photo functionality to the backend. Users will send photos from the frontend, and we need to:

1. **Receive the file** — regular JSON requests can't carry files. File uploads use a format called `multipart/form-data`, which is what `<input type="file">` sends. The library **multer** handles parsing these requests for Express.
2. **Store the file** — we'll save files to a local `uploads/` folder on the server. (In production you'd use a cloud service like Cloudinary or AWS S3, but local storage is fine for development.)
3. **Save metadata to MongoDB** — we store the file path, who uploaded it, the lat/lng coordinates, and optional fields like captions and tags.

**Key concepts:**
- **Multer** — Express middleware that handles file uploads. After multer processes a request, the uploaded file is available on `req.file` (with info like filename, mimetype, size, and path).
- **Static files** — Express can serve files from a folder using `express.static()`. This lets the frontend load uploaded images via a URL.
- **ObjectId references** — In MongoDB/Mongoose, you can link documents together using IDs. Each photo stores the `user` ID of who uploaded it, referencing the User model.

**Useful resources:**
- [Multer npm docs](https://www.npmjs.com/package/multer) — read the "Usage", "DiskStorage", and "File filter" sections
- [Express static files guide](https://expressjs.com/en/starter/static-files.html)
- [Mongoose populate docs](https://mongoosejs.com/docs/populate.html) — for understanding ObjectId refs
- Search for "multer file upload express tutorial" for walkthroughs

---

## Tasks

### 1. Install file upload dependencies

- [ ] In the `server/` directory, install `multer`

### 2. Create the Photo model

- [ ] Create `server/models/Photo.js`
- [ ] Define a Mongoose schema with these fields:
  - `user` — an ObjectId that references the User model (required). This links each photo to the user who uploaded it.
  - `imageUrl` — String, required. The path or URL to the stored image file.
  - `location` — an object containing `lat` (Number, required) and `lng` (Number, required)
  - `caption` — String, optional, defaults to empty string
  - `tags` — array of Strings, defaults to empty array
  - `isPublic` — Boolean, defaults to `false`
  - `createdAt` — Date, defaults to current time
  > Look up "mongoose ObjectId ref" to see how to set up the user reference. The `tags` and `isPublic` fields won't be actively used yet, but including them now avoids schema changes later.

### 3. Configure multer for local file storage

- [ ] Create an `uploads/` directory inside `server/`
- [ ] Add `uploads/` to `server/.gitignore`
- [ ] Create a multer configuration file (e.g., `server/config/upload.js`) that sets up:
  - **Disk storage** — save files to the `uploads/` folder with unique filenames (e.g., prepend a timestamp to avoid name collisions)
  - **File filter** — only accept JPEG, PNG, and HEIC files (check the `mimetype` property). Reject anything else with an error.
  - **Size limit** — reject files larger than 10MB
  > Read the multer docs on `diskStorage`, `fileFilter`, and the `limits` option. Export the configured multer instance.

### 4. Serve the uploads folder as static files

- [ ] In `server/index.js`, use `express.static()` to serve the `uploads/` directory
- [ ] This means a file saved at `server/uploads/photo123.jpg` should be accessible via `http://localhost:5001/uploads/photo123.jpg`
  > Look up the Express static files guide. You'll need the `path` module to construct the correct directory path.

### 5. Create the photo controller

- [ ] Create `server/controllers/photoController.js`
- [ ] Build these four functions:

**uploadPhoto:**
- [ ] Get `lat`, `lng`, `caption`, and `tags` from the request body
- [ ] Get the uploaded file info from `req.file` (multer puts it there)
- [ ] Validate that a file was actually uploaded and that lat/lng are provided — return `400` if not
- [ ] Create a new Photo document in MongoDB with the file path as `imageUrl` and the logged-in user's ID
- [ ] Return the created photo with status `201`

**getUserPhotos:**
- [ ] Find all photos where the `user` field matches the logged-in user's ID (`req.user.id`)
- [ ] Sort by `createdAt` descending (newest first)
- [ ] Return the array

**getPhotoById:**
- [ ] Find a photo by its `_id` (from the URL parameter)
- [ ] If not found → return `404`
- [ ] If the photo is private and the logged-in user doesn't own it → return `403`
- [ ] Otherwise return the photo

**deletePhoto:**
- [ ] Find the photo by `_id`
- [ ] If not found → return `404`
- [ ] If the logged-in user doesn't own it → return `403`
- [ ] Delete the actual file from the `uploads/` folder (look up Node's `fs.unlink`)
- [ ] Delete the document from MongoDB
- [ ] Return a success message

### 6. Create photo routes

- [ ] Create `server/routes/photoRoutes.js`
- [ ] All routes must be protected by the auth middleware from Sprint 2
- [ ] Define these routes:
  - `POST /api/photos` — uses multer middleware (for a single file upload) + the uploadPhoto controller
  - `GET /api/photos` — calls getUserPhotos
  - `GET /api/photos/:id` — calls getPhotoById
  - `DELETE /api/photos/:id` — calls deletePhoto
- [ ] Mount the routes in `server/index.js`
  > For the POST route, you'll chain two middleware functions: multer's `.single('photo')` (which tells multer to expect one file in a form field called "photo") and then your controller function.

### 7. Test everything manually

Use **Postman**, **Thunder Client**, or **curl**. You'll need a valid JWT token from Sprint 2.

- [ ] Upload a JPEG with lat/lng values → expect `201` + photo object with an imageUrl
  > **Note:** when testing file uploads, you need to send as `form-data`, not JSON. In Postman, select "Body" → "form-data" and set the file field type to "File". In curl, use the `-F` flag instead of `-d`.
- [ ] Upload without a file → expect `400`
- [ ] Upload a .txt file → expect `400` (invalid file type)
- [ ] Get all your photos → expect an array of your uploads
- [ ] Get a single photo by ID → expect the photo object
- [ ] Delete a photo → expect success, and confirm the file is removed from the `uploads/` folder
- [ ] Try to access another user's private photo → expect `403`
- [ ] Open the image URL directly in a browser → confirm the image loads

---

## Deliverables Checklist

- [ ] `POST /api/photos` — upload an image with lat/lng, returns photo object
- [ ] `GET /api/photos` — list all of the current user's photos
- [ ] `GET /api/photos/:id` — get a single photo's details
- [ ] `DELETE /api/photos/:id` — delete a photo (removes both file and DB record)
- [ ] File type validation works (rejects non-images)
- [ ] File size validation works (rejects files over 10MB)
- [ ] Uploaded images are accessible via their URL
- [ ] Only the photo owner can delete their photos
