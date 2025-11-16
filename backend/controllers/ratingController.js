const Rating = require('../models/Rating');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// @desc    Create rating
// @route   POST /api/ratings
// @access  Private (Buyer only)
const createRating = async (req, res) => {
  try {
    const { sellerId, auctionId, rating, comment } = req.body;
    const buyerId = req.user.id;

    // Get auction to verify it's closed and check seller
    const auction = await Auction.findById(auctionId);
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (auction.seller_id.toString() !== sellerId) {
      return res.status(400).json({ message: 'Invalid seller or auction' });
    }

    if (auction.status !== 'closed') {
      return res.status(400).json({ message: 'Can only rate closed auctions' });
    }

    // Check if buyer participated in auction
    const bidExists = await Bid.findOne({
      auction_id: auctionId,
      buyer_id: buyerId
    });

    if (!bidExists) {
      return res.status(400).json({ 
        message: 'You can only rate sellers for auctions you participated in' 
      });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      buyer_id: buyerId,
      auction_id: auctionId
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = parseInt(rating);
      existingRating.comment = comment;
      await existingRating.save();

      return res.json({
        message: 'Rating updated successfully',
        ratingId: existingRating._id
      });
    }

    // Create new rating
    const newRating = await Rating.create({
      seller_id: sellerId,
      buyer_id: buyerId,
      auction_id: auctionId,
      rating: parseInt(rating),
      comment
    });

    res.status(201).json({
      message: 'Rating submitted successfully',
      ratingId: newRating._id
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

    // Get all ratings for seller
    const ratings = await Rating.find({ seller_id: userId })
      .populate('buyer_id', 'username')
      .populate('auction_id', 'title')
      .sort({ createdAt: -1 })
      .lean();

    // Format ratings
    const formattedRatings = ratings.map(r => ({
      ...r,
      buyer_username: r.buyer_id?.username,
      auction_title: r.auction_id?.title
    }));

    // Calculate statistics
    const totalRatings = ratings.length;
    const avgRating = totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    const breakdown = {
      fiveStar: ratings.filter(r => r.rating === 5).length,
      fourStar: ratings.filter(r => r.rating === 4).length,
      threeStar: ratings.filter(r => r.rating === 3).length,
      twoStar: ratings.filter(r => r.rating === 2).length,
      oneStar: ratings.filter(r => r.rating === 1).length
    };

    res.json({
      ratings: formattedRatings,
      stats: {
        totalRatings,
        averageRating: avgRating.toFixed(2),
        breakdown
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
