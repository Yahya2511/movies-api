# Movies API

REST API for movies, ratings and playlists. Node.js, Express 5, PostgreSQL, Sequelize, JWT.

## Setup

1. Create an empty PostgreSQL database (for example `moviesdb`).
2. Create a `.env` file:

```
DB_NAME=moviesdb
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
JWT_SECRET=a-long-random-string
CLIENT_URL=http://localhost:3001
PORT=3000
```

3. Install and run:

```
npm install
npm run seed   # wipes the database and adds test data
npm run dev
```

Seed accounts: `admin@mail.com / admin123` and `bob@mail.com / 123456`.

## Routes

Access: Public, Login (token), Admin (admin token).
Send the token as `Authorization: Bearer <token>`.

### Auth

- POST /auth/register (Public)
- POST /auth/login (Public)
- GET /auth/me (Login)

### Movies

- GET /movies (Public), supports `?name=`
- GET /movies/:id (Public)
- POST /movies (Admin)
- PUT /movies/:id (Admin)
- DELETE /movies/:id (Admin)

### Ratings

- GET /movies/:movieId/ratings (Public)
- GET /movies/:movieId/ratings/:userId (Public)
- POST /movies/:movieId/ratings (Login)
- PUT /movies/:movieId/ratings (Login, own rating)
- DELETE /movies/:movieId/ratings (Login, own rating)

### Users

- GET /users (Admin)
- DELETE /users/:id (Admin)

### Playlists (Login, own playlists only)

- GET /playlists
- POST /playlists
- GET /playlists/:id
- PUT /playlists/:id
- DELETE /playlists/:id
- POST /playlists/:id/movies
- DELETE /playlists/:id/movies/:movieId
