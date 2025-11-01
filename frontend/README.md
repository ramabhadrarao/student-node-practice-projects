# Frontend (Create React App)

Simple React app for student learning with:

- Login and Register pages
- Dashboard after successful login
- Bootstrap styling and React Router for navigation

## Getting Started

1. Install dependencies (already installed by CRA, plus Router & Bootstrap):

```
npm install
```

2. Start the app:

```
npm start
```

The app runs at `http://localhost:3000`.

## How It Works

- `Login.jsx` posts credentials to `http://localhost:5000/api/auth/login`.
  - On success, stores `token` in `localStorage` and redirects to `/dashboard`.
- `Register.jsx` posts to `http://localhost:5000/api/auth/register`.
- `Dashboard.jsx` calls `GET /api/auth/me` with `Authorization: Bearer <token>`.
- Logout removes the token and redirects to Login.

## Notes

- Make sure the backend is running at `http://localhost:5000`.
- If you see CORS issues, confirm the backend has `app.use(cors())`.
- Styling uses Bootstrap classes; feel free to tweak.
