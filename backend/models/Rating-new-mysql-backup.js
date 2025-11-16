const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  auction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
ratingSchema.index({ seller_id: 1 });
ratingSchema.index({ buyer_id: 1 });
ratingSchema.index({ auction_id: 1 });

// Unique constraint: one rating per buyer per auction
ratingSchema.index({ buyer_id: 1, auction_id: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
