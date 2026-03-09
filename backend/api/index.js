require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
const { errorHandler, notFound } = require('../middleware/errorMiddleware');

const app = express();

// ===== CORS — allow localhost dev + any Vercel deployment + custom domain =====
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  /^https:\/\/.*\.vercel\.app$/,        // any *.vercel.app preview URL
  'https://the-movie-point.vercel.app', // production Vercel URL (update when known)
  'https://www.themoviewpoint.com',     // custom domain (update when configured)
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. Postman, server-to-server)
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some((o) =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (allowed) return callback(null, true);
    callback(new Error(`CORS: Origin '${origin}' not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== DB — connect once per cold start (serverless-safe) =====
let isConnected = false;
const ensureDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// Run DB connection before every request
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    next(err);
  }
});

// ===== Health check =====
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🎬 The Movie Point API is running', timestamp: new Date().toISOString() });
});

// ===== Routes =====
app.use('/api/auth',      require('../routes/authRoutes'));
app.use('/api/movies',    require('../routes/movieRoutes'));
app.use('/api/users',     require('../routes/userRoutes'));
app.use('/api/favorites', require('../routes/favoritesRoutes'));
app.use('/api/history',   require('../routes/historyRoutes'));

// ===== Error middleware =====
app.use(notFound);
app.use(errorHandler);

// ===== Local dev: listen on port =====
// Vercel ignores this; it invokes the exported handler directly
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

// ===== Serverless export for Vercel =====
module.exports = app;
