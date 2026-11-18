# Movies API

REST API for movies, ratings, playlists and users.
Stack: Node.js, Express 5, PostgreSQL, Sequelize, JWT, bcrypt, zod.

Front end repo: [PUT FRONT END REPO LINK HERE]

## Requirements

- Node.js 20 or newer
- PostgreSQL (any recent version)

## Setup

1. Create an empty PostgreSQL database, for example `moviesdb`.
2. Copy `.env.example` to `.env` and fill in the values:

```
DB_NAME=moviesdb
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
JWT_SECRET=change-me-to-a-long-random-string
CLIENT_URL=http://localhost:3001
PORT=3000
```

3. Install and run:

```
npm install
npm run dev
```

The API runs on http://localhost:3000. The server refuses to start if
`JWT_SECRET` is missing.

## Database

- Tables are created automatically by `sequelize.sync()` when the API starts.
  An empty database is all you need.
- `sync()` creates missing tables but does NOT change existing ones. If you
  change a model, update the table manually or recreate the database.
- Tables: Users, Movies, Ratings, Playlists, PlaylistMovie.
- Relations: a User has many Ratings and Playlists. A Movie has many Ratings.
  Playlists and Movies are many-to-many (PlaylistMovie).
- One rating per user per movie (unique index on UserId + MovieId).
- Deleting a user or movie deletes their ratings and playlists (CASCADE).

## Seed data (optional)

```
npm run seed
```

WARNING: this DROPS ALL TABLES and recreates them. Use it only on a test
database, never on real data.

It adds 10 movies, 2 users, a few ratings and one playlist.

| Role  | Email          | Password |
|-------|----------------|----------|
| admin | admin@mail.com | admin123 |
| user  | bob@mail.com   | 123456   |

These passwords are for testing only.

## Scripts

- `npm run dev`: start with nodemon (auto restart)
- `npm start`: start with node
- `npm run seed`: reset the database and add test data

## Authentication

- Register or log in to get a JWT (valid for 1 day).
- Send it on protected routes: `Authorization: Bearer <token>`
- Roles: `user` and `admin`. The role is stored in the token.
- Access levels below: Public (anyone), Login (valid token), Admin (admin token).
- Passwords: 6 to 26 characters, stored as bcrypt hashes.

## Routes

### Auth
- POST /auth/register (Public). Body: `name`, `email`, `password`
- POST /auth/login (Public). Body: `email`, `password`. Returns `{ token }`
- GET /auth/me (Login). Returns id, name, email, role

### Movies
- GET /movies (Public). Query options:
  - `name`: partial match, case-insensitive
  - `director`: partial match, case-insensitive
  - `sort`: `name`, `newest`, `length`, `rating`
  - `page` (default 1), `limit` (default 10, max 50)
  - Returns `{ data, page, limit, total, totalPages }`
  - Each movie includes `averageRating` (null if no ratings)
- GET /movies/:id (Public)
- POST /movies (Admin). Body: `name` (required), `lengthMin`, `director`, `description`
- PUT /movies/:id (Admin). Same fields, all optional
- DELETE /movies/:id (Admin)

### Ratings
- GET /movies/:movieId/ratings (Public)
- GET /movies/:movieId/ratings/:userId (Public)
- POST /movies/:movieId/ratings (Login). Body: `rate` (integer 1 to 10), `comment` (optional)
- PUT /movies/:movieId/ratings (Login, own rating only)
- DELETE /movies/:movieId/ratings (Login, own rating only)

### Users
- GET /users (Admin). Normal users only, never returns password hashes
- DELETE /users/:id (Admin). Admins cannot be deleted

### Playlists (Login, own playlists only)
- GET /playlists
- POST /playlists. Body: `name`
- GET /playlists/:id (includes its movies)
- PUT /playlists/:id. Body: `name`
- DELETE /playlists/:id
- POST /playlists/:id/movies. Body: `movieId` (number)
- DELETE /playlists/:id/movies/:movieId

## Status codes

200 OK, 201 created, 204 deleted (empty body), 400 invalid input,
401 not logged in, 403 not allowed, 404 not found, 409 already exists,
500 server error.

## Project structure

```
config/       database connection
models/       Sequelize models and relations (index.js)
controllers/  the logic of each route
routes/       URL to controller mapping
middleware/   auth (requireLogin, requireAdmin), validate, validateId
validators/   zod schemas
seed.js       test data
app.js        server entry point
```

## Security notes

- Ownership checks: ratings and playlists always use the user id from the
  token, never from the request body.
- Input is validated with zod, ids are validated in the URL.
- CORS only allows `CLIENT_URL`.
- Known limits: no rate limiting on login, no automated tests, and a deleted
  user's token stays valid until it expires (1 day).