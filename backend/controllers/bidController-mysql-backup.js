const Bid = require('../models/Bid');
const Auction = require('../models/Auction');

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private (Buyer only)
const placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;
    const buyerId = req.user.id;

    // Get auction details
    const auction = await Auction.findById(auctionId);
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if auction is active
    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Auction is not active' });
    }

    // Check if auction has ended
    const timeLeft = await Auction.getTimeRemaining(auctionId);
    if (timeLeft <= 0) {
      await Auction.updateStatus(auctionId, 'closed');
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Check if buyer is trying to bid on their own auction
    if (auction.seller_id === buyerId) {
      return res.status(400).json({ message: 'Cannot bid on your own auction' });
    }

    // Validate bid amount
    const bidAmount = parseFloat(amount);
    const currentPrice = parseFloat(auction.current_price || auction.starting_price);
    
    if (bidAmount <= currentPrice) {
      return res.status(400).json({ 
        message: `Bid must be higher than current price of $${currentPrice.toFixed(2)}` 
      });
    }

    // Get highest bid
    const highestBid = await Bid.getHighestBid(auctionId);
    if (highestBid && bidAmount <= parseFloat(highestBid.amount)) {
      return res.status(400).json({ 
        message: `Bid must be higher than highest bid of $${parseFloat(highestBid.amount).toFixed(2)}` 
      });
    }

    // Create bid
    const bidId = await Bid.create({
      auctionId,
      buyerId,
      amount: bidAmount
    });

    // Update auction current price
    await Auction.updateCurrentPrice(auctionId, bidAmount);

    // Get bid details
    const bid = {
      id: bidId,
      auction_id: auctionId,
      buyer_id: buyerId,
      amount: bidAmount,
      buyer_username: req.user.username
    };

    // Emit socket event for new bid
    if (req.app.get('io')) {
      req.app.get('io').emit('new_bid', {
        auctionId,
        highestBid: bidAmount,
        buyerUsername: req.user.username,
        previousBidderId: highestBid?.buyer_id
      });
    }

    res.status(201).json({
      message: 'Bid placed successfully',
      bid
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Server error placing bid' });
  }
};

// @desc    Get buyer's bids
// @route   GET /api/buyer/bids
// @access  Private (Buyer only)
const getBuyerBids = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const bids = await Bid.findByBuyer(buyerId);

    res.json({
      bids,
      count: bids.length
    });
  } catch (error) {
    console.error('Get buyer bids error:', error);
    res.status(500).json({ message: 'Server error fetching bids' });
  }
};

// @desc    Get bids for an auction
// @route   GET /api/auctions/:id/bids
// @access  Public
const getAuctionBids = async (req, res) => {
  try {
    const { id } = req.params;
    const bids = await Bid.findByAuction(id);

    res.json({
      bids,
      count: bids.length
    });
  } catch (error) {
    console.error('Get auction bids error:', error);
    res.status(500).json({ message: 'Server error fetching bids' });
  }
};

module.exports = {
  placeBid,
  getBuyerBids,
  getAuctionBids
};
