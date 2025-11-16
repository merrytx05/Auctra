const express = require('express');
const router = express.Router();
const { createRating, getSellerRatings } = require('../controllers/ratingController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { ratingValidation } = require('../middleware/validation');

// Public route
router.get('/:userId', getSellerRatings);

// Protected route - Buyer only
router.post(
  '/',
  authMiddleware,
  requireRole('buyer'),
  ratingValidation,
  createRating
);

module.exports = router;
