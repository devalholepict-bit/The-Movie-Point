const express = require('express');
const router = express.Router();
const { getHistory, addToHistory, clearHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getHistory).post(protect, addToHistory).delete(protect, clearHistory);

module.exports = router;
