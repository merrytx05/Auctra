const Rating = require('../models/Rating');
const Auction = require('../models/Auction');

// @desc    Create rating
// @route   POST /api/ratings
// @access  Private (Buyer only)
const createRating = async (req, res) => {
  try {
    const { sellerId, auctionId, rating, comment } = req.body;
    const buyerId = req.user.id;

    // Check if buyer can rate (must have bid on closed auction)
    const canRate = await Rating.canRate(buyerId, auctionId);
    if (!canRate) {
      return res.status(400).json({ 
        message: 'You can only rate sellers for closed auctions you participated in' 
      });
    }

    // Get auction to verify seller
    const auction = await Auction.findById(auctionId);
    if (!auction || auction.seller_id !== sellerId) {
      return res.status(400).json({ message: 'Invalid seller or auction' });
    }

    // Create or update rating
    const ratingId = await Rating.create({
      sellerId,
      buyerId,
      auctionId,
      rating: parseInt(rating),
      comment
    });

    res.status(201).json({
      message: 'Rating submitted successfully',
      ratingId
    });
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ message: 'Server error creating rating' });
  }
};

// @desc    Get seller ratings
// @route   GET /api/ratings/:userId
// @access  Public
const getSellerRatings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get ratings
    const ratings = await Rating.findBySeller(userId);
    
    // Get average rating
    const stats = await Rating.getAverageRating(userId);

    res.json({
      ratings,
      stats: {
        totalRatings: stats.total_ratings,
        averageRating: parseFloat(stats.average_rating || 0).toFixed(2),
        breakdown: {
          fiveStar: stats.five_star,
          fourStar: stats.four_star,
          threeStar: stats.three_star,
          twoStar: stats.two_star,
          oneStar: stats.one_star
        }
      }
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ message: 'Server error fetching ratings' });
  }
};

module.exports = {
  createRating,
  getSellerRatings
};
