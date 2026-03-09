const asyncHandler = require('express-async-handler');
const Movie = require('../models/Movie');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 20 } = req.query;
  const filter = category ? { category } : {};
  const movies = await Movie.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));
  const total = await Movie.countDocuments(filter);
  res.json({ success: true, data: movies, total, page: Number(page) });
});

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }
  res.json({ success: true, data: movie });
});

// @desc    Create movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = asyncHandler(async (req, res) => {
  const { title, posterUrl, description, movieId, releaseDate, trailerLink, genre, category, rating } = req.body;

  if (!title || !movieId) {
    res.status(400);
    throw new Error('Title and movieId are required');
  }

  const existingMovie = await Movie.findOne({ movieId });
  if (existingMovie) {
    res.status(400);
    throw new Error('Movie with this TMDB ID already exists');
  }

  const movie = await Movie.create({
    title,
    posterUrl: posterUrl || '',
    description: description || 'Description not available.',
    movieId,
    releaseDate: releaseDate || '',
    trailerLink: trailerLink || '',
    genre: genre || [],
    category: category || 'movie',
    rating: rating || 0,
    addedBy: req.user._id,
  });

  res.status(201).json({ success: true, data: movie });
});

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: updated });
});

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }
  await movie.deleteOne();
  res.json({ success: true, message: 'Movie deleted successfully' });
});

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };
