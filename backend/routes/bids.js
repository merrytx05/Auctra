const express = require('express');
const router = express.Router();
const { placeBid, getBuyerBids } = require('../controllers/bidController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { bidValidation } = require('../middleware/validation');

// Protected routes - Buyer only
router.post(
  '/',
  authMiddleware,
  requireRole('buyer'),
  bidValidation,
  placeBid
);

router.get(
  '/my-bids',
  authMiddleware,
  requireRole('buyer'),
  getBuyerBids
);

module.exports = router;
