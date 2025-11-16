const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true
  },
  starting_price: {
    type: Number,
    required: true,
    min: 0
  },
  current_price: {
    type: Number,
    required: true,
    min: 0
  },
  image_url: {
    type: String
  },
  duration: {
    type: Number,
    required: true
  },
  start_time: {
    type: Date,
    default: Date.now
  },
  end_time: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
auctionSchema.index({ seller_id: 1 });
auctionSchema.index({ status: 1 });
auctionSchema.index({ end_time: 1 });
auctionSchema.index({ createdAt: -1 });

// Virtual for bid count
auctionSchema.virtual('bid_count', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'auction_id',
  count: true
});

// Virtual for highest bid
auctionSchema.virtual('highest_bid', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'auction_id',
  justOne: true,
  options: { sort: { amount: -1 } }
});

// Set end_time before saving
auctionSchema.pre('save', function(next) {
  if (this.isNew && this.duration) {
    this.end_time = new Date(Date.now() + this.duration * 1000);
    this.current_price = this.starting_price;
  }
  next();
});

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
