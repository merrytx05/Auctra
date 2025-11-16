const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllAuctions,
  blockUser,
  deleteAuction
} = require('../controllers/adminController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// All routes require admin role
router.use(authMiddleware, requireRole('admin'));

router.get('/users', getAllUsers);
router.get('/auctions', getAllAuctions);
router.put('/users/:id/block', blockUser);
router.delete('/auctions/:id', deleteAuction);

module.exports = router;
