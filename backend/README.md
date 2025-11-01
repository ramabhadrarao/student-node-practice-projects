# Backend (Node + Express + Mongoose)

This is a simple backend for student learning. It includes:

- Express server
- CORS enabled (so React frontend can call it)
- MongoDB (via Mongoose) User model
- Register, Login, and Me (current user) routes
- JWT-based authentication

## Prerequisites

- Node.js and npm installed
- A MongoDB connection string (MongoDB Atlas recommended)

## Setup

1. Copy `.env.example` to `.env` and fill in values:
   - `MONGO_URI` – your MongoDB connection string
   - `JWT_SECRET` – any secret string
   - `PORT` – optional (defaults to 5000)

2. Install dependencies:

```
npm install
```

3. Start the server:

```
npm start
```

The server runs at `http://localhost:5000`.

## API Routes

- `POST /api/auth/register`
  - Body: `{ name, email, password }`
  - Creates a user and returns a success message.

- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Returns a JWT `token` and basic `user` info.

- `GET /api/auth/me`
  - Header: `Authorization: Bearer <token>`
  - Returns the currently logged-in user.

## Notes

- Passwords are hashed using `bcrypt`.
- Tokens are signed with `JWT_SECRET` and are stateless (no sessions).
- For logout on the frontend, simply remove the stored token.

## Common Tips

- If you see `MongoDB connection error`, check your `MONGO_URI`.
- If CORS errors occur, ensure the frontend runs on `http://localhost:3000` and the backend has `app.use(cors())`.