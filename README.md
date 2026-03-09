# 🎬 CineVerse – Movie Discovery Platform

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
    └── .env                      # TMDB API key + backend URL
```

---

## ⚙️ Environment Variables

### Backend — `backend/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/moviedb
JWT_SECRET=your_super_secret_jwt_key_replace_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend — `frontend/.env`
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🔑 Getting a TMDB API Key

1. Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Create a free account and request an API key
3. Paste the key into `frontend/.env` as `VITE_TMDB_API_KEY`

---

## 🗄️ Connecting MongoDB

**Option A – Local MongoDB:**
```
MONGO_URI=mongodb://localhost:27017/moviedb
```

**Option B – MongoDB Atlas (Cloud):**
1. Create a free cluster at [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Get your connection string and paste it as:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/moviedb
```

---

## ▶️ Running the Application

### Step 1 — Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI and JWT secret
npm run dev
# Server runs on http://localhost:5000
```

### Step 2 — Frontend
```bash
cd frontend
npm install
# Edit .env with your TMDB API key
npm run dev
# App runs on http://localhost:5173
```

---

## 👤 Creating an Admin User

After registering a user via the app, update the role via MongoDB:

**Using MongoDB Shell or Compass:**
```js
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Then log in to access `/admin` dashboard.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |

### Movies (Admin CRUD)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/movies` | Public |
| POST | `/api/movies` | Admin |
| GET | `/api/movies/:id` | Public |
| PUT | `/api/movies/:id` | Admin |
| DELETE | `/api/movies/:id` | Admin |

### Users (Admin)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users` | Admin |
| DELETE | `/api/users/:id` | Admin |
| PUT | `/api/users/ban/:id` | Admin |

### Favorites
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/favorites` | Private |
| POST | `/api/favorites` | Private |
| DELETE | `/api/favorites/:movieId` | Private |

### Watch History
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/history` | Private |
| POST | `/api/history` | Private |
| DELETE | `/api/history` | Private (clear all) |

---

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
