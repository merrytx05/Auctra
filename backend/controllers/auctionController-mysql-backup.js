const Auction = require('../models/Auction');
const path = require('path');

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
    const auctionId = await Auction.create({
      sellerId,
      title,
      description,
      startingPrice: parseFloat(startingPrice),
      duration: parseInt(duration),
      imageUrl
    });

    // Get created auction details
    const auction = await Auction.findById(auctionId);

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

    const auctions = await Auction.findAll({
      search,
      status,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

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
    const auction = await Auction.findById(id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

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
    const auctions = await Auction.findBySeller(sellerId);

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

    await Auction.delete(id);

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
