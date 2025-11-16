const User = require('../models/User');
const Auction = require('../models/Auction');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
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
    const auctions = await Auction.findAll({ limit: 1000, offset: 0 });
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

    await User.updateBlockStatus(id, isBlocked);

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

    await Auction.delete(id);

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
