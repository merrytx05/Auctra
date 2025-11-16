const User = require('../models/User');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Get all auctions
// @route   GET /api/admin/auctions
// @access  Private (Admin only)
const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate('seller_id', 'username email')
      .sort({ createdAt: -1 })
      .lean();

    // Add bid counts
    for (let auction of auctions) {
      const bid_count = await Bid.countDocuments({ auction_id: auction._id });
      const highestBid = await Bid.findOne({ auction_id: auction._id })
        .sort({ amount: -1 })
        .select('amount');
      
      auction.bid_count = bid_count;
      auction.highest_bid = highestBid?.amount || null;
    }

    res.json({ auctions, count: auctions.length });
  } catch (error) {
    console.error('Get auctions error:', error);
    res.status(500).json({ message: 'Server error fetching auctions' });
  }
};

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private (Admin only)
const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot block admin users' });
    }

    user.is_blocked = isBlocked;
    await user.save();

    res.json({ 
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` 
    });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
};

// @desc    Delete auction
// @route   DELETE /api/admin/auctions/:id
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
  getAllUsers,
  getAllAuctions,
  blockUser,
  deleteAuction
};
