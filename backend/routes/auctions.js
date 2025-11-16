const express = require('express');
const router = express.Router();
const {
  createAuction,
  getAuctions,
  getAuctionById,
  getSellerAuctions,
  deleteAuction
} = require('../controllers/auctionController');
const { getAuctionBids } = require('../controllers/bidController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { auctionValidation } = require('../middleware/validation');
const upload = require('../utils/upload');

// Public routes
router.get('/', getAuctions);
router.get('/:id', getAuctionById);
router.get('/:id/bids', getAuctionBids);

// Protected routes - Seller only
router.post(
  '/',
  authMiddleware,
  requireRole('seller'),
  upload.single('image'),
  auctionValidation,
  createAuction
);

// Seller dashboard
router.get(
  '/seller/my-auctions',
  authMiddleware,
  requireRole('seller'),
  getSellerAuctions
);

// Admin only
router.delete(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  deleteAuction
);

module.exports = router;
