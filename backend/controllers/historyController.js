const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user watch history
// @route   GET /api/history
// @access  Private
const getHistory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('watchHistory');
  const sorted = user.watchHistory.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
  res.json({ success: true, data: sorted });
});

// @desc    Add movie to watch history
// @route   POST /api/history
// @access  Private
const addToHistory = asyncHandler(async (req, res) => {
  const { movieId, title, poster, mediaType } = req.body;

  if (!movieId || !title) {
    res.status(400);
    throw new Error('movieId and title are required');
  }

  const user = await User.findById(req.user._id);

  // Remove existing entry for this movie (to re-add as most recent)
  user.watchHistory = user.watchHistory.filter((h) => h.movieId !== String(movieId));

  // Add to front
  user.watchHistory.unshift({
    movieId: String(movieId),
    title,
    poster: poster || '',
    mediaType: mediaType || 'movie',
    watchedAt: new Date(),
  });

  // Keep only last 50 entries
  if (user.watchHistory.length > 50) {
    user.watchHistory = user.watchHistory.slice(0, 50);
  }

  await user.save();
  res.status(201).json({ success: true, data: user.watchHistory, message: 'Added to watch history' });
});

// @desc    Clear watch history
// @route   DELETE /api/history
// @access  Private
const clearHistory = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { watchHistory: [] });
  res.json({ success: true, message: 'Watch history cleared' });
});

module.exports = { getHistory, addToHistory, clearHistory };
