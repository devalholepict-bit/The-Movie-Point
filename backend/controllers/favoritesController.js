const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('favorites');
  res.json({ success: true, data: user.favorites });
});

// @desc    Add movie to favorites
// @route   POST /api/favorites
// @access  Private
const addFavorite = asyncHandler(async (req, res) => {
  const { movieId, title, poster, rating, releaseDate, mediaType } = req.body;

  if (!movieId || !title) {
    res.status(400);
    throw new Error('movieId and title are required');
  }

  const user = await User.findById(req.user._id);

  const alreadyFavorited = user.favorites.find((f) => f.movieId === String(movieId));
  if (alreadyFavorited) {
    return res.status(400).json({ success: false, message: 'Already in favorites' });
  }

  user.favorites.push({ movieId: String(movieId), title, poster: poster || '', rating: rating || 0, releaseDate: releaseDate || '', mediaType: mediaType || 'movie' });
  await user.save();

  res.status(201).json({ success: true, data: user.favorites, message: 'Added to favorites' });
});

// @desc    Remove movie from favorites
// @route   DELETE /api/favorites/:movieId
// @access  Private
const removeFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const initialLength = user.favorites.length;
  user.favorites = user.favorites.filter((f) => f.movieId !== req.params.movieId);

  if (user.favorites.length === initialLength) {
    res.status(404);
    throw new Error('Favorite not found');
  }

  await user.save();
  res.json({ success: true, data: user.favorites, message: 'Removed from favorites' });
});

module.exports = { getFavorites, addFavorite, removeFavorite };
