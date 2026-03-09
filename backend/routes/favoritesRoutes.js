const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoritesController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFavorites).post(protect, addFavorite);
router.route('/:movieId').delete(protect, removeFavorite);

module.exports = router;
