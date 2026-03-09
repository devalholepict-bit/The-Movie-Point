const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, banUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getUsers);
router.delete('/:id', protect, adminOnly, deleteUser);
router.put('/ban/:id', protect, adminOnly, banUser);

module.exports = router;
