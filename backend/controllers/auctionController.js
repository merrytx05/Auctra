const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// @desc    Create new auction
// @route   POST /api/auctions
// @access  Private (Seller only)
const createAuction = async (req, res) => {
  try {
    const { title, description, startingPrice, duration } = req.body;
    const sellerId = req.user.id;

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Create auction
    const auction = await Auction.create({
      seller_id: sellerId,
      title,
      description,
      starting_price: parseFloat(startingPrice),
      duration: parseInt(duration),
      image_url: imageUrl
    });

    // Populate seller info
    await auction.populate('seller_id', 'username email');

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('auction_created', auction);
    }

    res.status(201).json({
      message: 'Auction created successfully',
      auction
    });
  } catch (error) {
    console.error('Create auction error:', error);
    res.status(500).json({ message: 'Server error creating auction' });
  }
};

// @desc    Get all auctions
// @route   GET /api/auctions
// @access  Public
const getAuctions = async (req, res) => {
  try {
    const { search, status, limit = 20, offset = 0 } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }

    // Get auctions
    const auctions = await Auction.find(query)
      .populate('seller_id', 'username email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();

    // Get bid counts and highest bids for each auction
    for (let auction of auctions) {
      const bid_count = await Bid.countDocuments({ auction_id: auction._id });
      const highestBid = await Bid.findOne({ auction_id: auction._id })
        .sort({ amount: -1 })
        .select('amount');
      
      auction.bid_count = bid_count;
      auction.highest_bid = highestBid?.amount || null;
      auction.seller_username = auction.seller_id?.username;
    }

    res.json({
      auctions,
      count: auctions.length
    });
  } catch (error) {
    console.error('Get auctions error:', error);
    res.status(500).json({ message: 'Server error fetching auctions' });
  }
};

// @desc    Get auction by ID
// @route   GET /api/auctions/:id
// @access  Public
const getAuctionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const auction = await Auction.findById(id)
      .populate('seller_id', 'username email')
      .lean();

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Get bid count and highest bid
    const bid_count = await Bid.countDocuments({ auction_id: auction._id });
    const highestBid = await Bid.findOne({ auction_id: auction._id })
      .sort({ amount: -1 })
      .select('amount');

    auction.bid_count = bid_count;
    auction.highest_bid = highestBid?.amount || null;
    auction.seller_username = auction.seller_id?.username;
    auction.seller_email = auction.seller_id?.email;

    res.json({ auction });
  } catch (error) {
    console.error('Get auction error:', error);
    res.status(500).json({ message: 'Server error fetching auction' });
  }
};

// @desc    Get seller's auctions
// @route   GET /api/seller/auctions
// @access  Private (Seller only)
const getSellerAuctions = async (req, res) => {
  try {
    const sellerId = req.user.id;
    
    const auctions = await Auction.find({ seller_id: sellerId })
      .sort({ createdAt: -1 })
      .lean();

    // Add bid counts and highest bids
    for (let auction of auctions) {
      const bid_count = await Bid.countDocuments({ auction_id: auction._id });
      const highestBid = await Bid.findOne({ auction_id: auction._id })
        .sort({ amount: -1 })
        .select('amount');
      
      auction.bid_count = bid_count;
      auction.highest_bid = highestBid?.amount || null;
    }

    res.json({
      auctions,
      count: auctions.length
    });
  } catch (error) {
    console.error('Get seller auctions error:', error);
    res.status(500).json({ message: 'Server error fetching auctions' });
  }
};

// @desc    Delete auction
// @route   DELETE /api/auctions/:id
// @access  Private (Admin only)
const deleteAuction = async (req, res) => {
  try {
    const { id } = req.params;

    const auction = await Auction.findById(id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    await Auction.findByIdAndDelete(id);

    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    console.error('Delete auction error:', error);
    res.status(500).json({ message: 'Server error deleting auction' });
  }
};

module.exports = {
  createAuction,
  getAuctions,
  getAuctionById,
  getSellerAuctions,
  deleteAuction
};
