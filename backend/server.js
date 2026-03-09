require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Connect to database
connectDB();

const app = express();

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://the-movie-point.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.options('*', cors(corsOptions)); // Handle pre-flight for all routes
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🎬 Movie Platform API is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/favorites', require('./routes/favoritesRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
