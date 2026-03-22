# 🎬 THE MOVIE POINT – Movie Discovery Platform

A **production-level full stack** Movie Discovery Platform built with the **MERN stack** (MongoDB, Express, React, Node.js).

---

## 🚀 Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18 + Vite, Redux Toolkit, React Router v6, Axios |
| Backend | Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs |
| API | TMDB (The Movie Database) |
| UI | Vanilla CSS, dark/light mode, responsive |

---

## 📁 Project Structure

```
TESTING/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # auth, movies, users, favorites, history
│   ├── middleware/               # authMiddleware, errorMiddleware
│   ├── models/                   # User.js, Movie.js
│   ├── routes/                   # authRoutes, movieRoutes, userRoutes, etc.
│   ├── server.js                 # Entry point
│   └── .env                      # Environment variables
└── frontend/
    ├── src/
    │   ├── components/           # Navbar, MovieCard, TrailerModal, SkeletonCard
    │   ├── hooks/                # useDebounce, useInfiniteScroll
    │   ├── pages/                # All 12 pages
    │   ├── redux/                # store + slices (auth, movies, favorites, history, ui)
    │   ├── services/             # tmdbService.js, apiService.js
    │   └── utils/                # helpers.js
    └── .env                      # TMDB API key + backend URI
```

## ✨ Features

- 🎬 **TMDB Integration** — Trending, Popular, Movies, TV Shows, People
- 🔍 **Real-time Search** with debouncing (400ms) across all media types
- ♾️ **Infinite Scroll** on Movies and TV pages
- 🎭 **Movie Detail Page** — poster, overview, cast, genres, similar movies
- ▶️ **Trailer Modal** — YouTube embed with unavailable fallback
- ❤️ **Favorites** — Add/remove movies (requires login)
- 🕐 **Watch History** — Auto-saved when opening movie/TV pages and watching trailers
- 🔐 **JWT Authentication** — Register, Login, Logout
- ⚙️ **Admin Dashboard** — Add/edit/delete movies, ban/unban/delete users
- 🌙 **Dark/Light Mode** — Persisted to localStorage
- 🎯 **Genre Filters** on Movies page
- 📱 **Fully Responsive** — Mobile, tablet, desktop
