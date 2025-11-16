const Bid = require('../models/Bid');
const Auction = require('../models/Auction');

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private (Buyer only)
const placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;
    const buyerId = req.user.id;

    console.log('Place bid request:', { auctionId, amount, buyerId, body: req.body });

    if (!auctionId) {
      return res.status(400).json({ message: 'Auction ID is required' });
    }

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
    const now = new Date();
    if (auction.end_time <= now) {
      auction.status = 'closed';
      await auction.save();
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Check if buyer is trying to bid on their own auction
    if (auction.seller_id.toString() === buyerId) {
      return res.status(400).json({ message: 'Cannot bid on your own auction' });
    }

    // Validate bid amount
    const bidAmount = parseFloat(amount);
    const currentPrice = parseFloat(auction.current_price);
    
    if (bidAmount <= currentPrice) {
      return res.status(400).json({ 
        message: `Bid must be higher than current price of $${currentPrice.toFixed(2)}` 
      });
    }

    // Get highest bid
    const highestBid = await Bid.findOne({ auction_id: auctionId })
      .sort({ amount: -1 })
      .populate('buyer_id', 'username');

    if (highestBid && bidAmount <= parseFloat(highestBid.amount)) {
      return res.status(400).json({ 
        message: `Bid must be higher than highest bid of $${parseFloat(highestBid.amount).toFixed(2)}` 
      });
    }

    // Create bid
    const bid = await Bid.create({
      auction_id: auctionId,
      buyer_id: buyerId,
      amount: bidAmount
    });

    // Populate buyer info
    await bid.populate('buyer_id', 'username');

    // Update auction current price
    auction.current_price = bidAmount;
    await auction.save();

    // Emit socket event for new bid
    if (req.app.get('io')) {
      req.app.get('io').emit('new_bid', {
        auctionId,
        highestBid: bidAmount,
        buyerUsername: req.user.username,
        previousBidderId: highestBid?.buyer_id?._id
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
    
    const bids = await Bid.find({ buyer_id: buyerId })
      .populate('auction_id', 'title status end_time start_time image_url current_price starting_price duration')
      .sort({ createdAt: -1 })
      .lean();

    // Add highest bid info and bid count for each auction
    for (let bid of bids) {
      if (bid.auction_id) {
        const highestBid = await Bid.findOne({ auction_id: bid.auction_id._id })
          .sort({ amount: -1 })
          .select('amount');
        
        const bidCount = await Bid.countDocuments({ auction_id: bid.auction_id._id });
        
        bid.auction_title = bid.auction_id.title;
        bid.auction_status = bid.auction_id.status;
        bid.auction_end_time = bid.auction_id.end_time;
        bid.auction_start_time = bid.auction_id.start_time;
        bid.auction_image = bid.auction_id.image_url;
        bid.auction_current_price = bid.auction_id.current_price;
        bid.auction_starting_price = bid.auction_id.starting_price;
        bid.auction_duration = bid.auction_id.duration;
        bid.highest_bid = highestBid?.amount || bid.amount;
        bid.bid_count = bidCount;
        bid.bid_time = bid.createdAt;
      }
    }

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
    
    console.log('Get auction bids request:', { id, params: req.params });

    if (!id) {
      return res.status(400).json({ message: 'Auction ID is required' });
    }
    
    const bids = await Bid.find({ auction_id: id })
      .populate('buyer_id', 'username')
      .sort({ amount: -1, createdAt: -1 })
      .lean();

    // Format the response
    const formattedBids = bids.map(bid => ({
      ...bid,
      buyer_username: bid.buyer_id?.username
    }));

    res.json({
      bids: formattedBids,
      count: formattedBids.length
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
