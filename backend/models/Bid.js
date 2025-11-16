const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  auction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for performance
bidSchema.index({ auction_id: 1 });
bidSchema.index({ buyer_id: 1 });
bidSchema.index({ amount: -1 });
bidSchema.index({ createdAt: -1 });

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
