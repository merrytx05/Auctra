const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Auction = require('./models/Auction');
const Bid = require('./models/Bid');
const Rating = require('./models/Rating');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auctra_db')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const mockUsers = [
  {
    username: 'john_seller',
    email: 'john@seller.com',
    password: 'Password123!',
    role: 'seller',
    full_name: 'John Seller',
    phone: '+1234567890'
  },
  {
    username: 'sarah_seller',
    email: 'sarah@seller.com',
    password: 'Password123!',
    role: 'seller',
    full_name: 'Sarah Johnson',
    phone: '+1234567891'
  },
  {
    username: 'mike_seller',
    email: 'mike@seller.com',
    password: 'Password123!',
    role: 'seller',
    full_name: 'Mike Thompson',
    phone: '+1234567892'
  },
  {
    username: 'emily_buyer',
    email: 'emily@buyer.com',
    password: 'Password123!',
    role: 'buyer',
    full_name: 'Emily Davis',
    phone: '+1234567893'
  },
  {
    username: 'alex_buyer',
    email: 'alex@buyer.com',
    password: 'Password123!',
    role: 'buyer',
    full_name: 'Alex Martinez',
    phone: '+1234567894'
  },
  {
    username: 'lisa_buyer',
    email: 'lisa@buyer.com',
    password: 'Password123!',
    role: 'buyer',
    full_name: 'Lisa Anderson',
    phone: '+1234567895'
  },
  {
    username: 'david_buyer',
    email: 'david@buyer.com',
    password: 'Password123!',
    role: 'buyer',
    full_name: 'David Wilson',
    phone: '+1234567896'
  },
  {
    username: 'anna_buyer',
    email: 'anna@buyer.com',
    password: 'Password123!',
    role: 'buyer',
    full_name: 'Anna Brown',
    phone: '+1234567897'
  }
];

const mockAuctions = [
  {
    title: 'Vintage Rolex Watch',
    description: 'Authentic Rolex Submariner from 1985, excellent condition with original papers and box. Perfect working order.',
    starting_price: 5000,
    current_price: 5000,
    category: 'Watches',
    duration: 7,
    end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'
  },
  {
    title: 'MacBook Pro 16" M3 Max',
    description: '2024 MacBook Pro with M3 Max chip, 64GB RAM, 2TB SSD. Barely used, like new condition with AppleCare+.',
    starting_price: 3000,
    current_price: 3500,
    category: 'Electronics',
    duration: 5,
    end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
  },
  {
    title: 'Antique Persian Rug',
    description: 'Hand-woven Persian rug from the 1920s, 8x10 feet, intricate floral design. Museum quality piece.',
    starting_price: 8000,
    current_price: 9200,
    category: 'Home & Garden',
    duration: 10,
    end_time: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800'
  },
  {
    title: 'Canon EOS R5 Camera Body',
    description: 'Professional mirrorless camera, 45MP full-frame sensor, 8K video. Only 5000 shutter count.',
    starting_price: 2500,
    current_price: 2800,
    category: 'Electronics',
    duration: 3,
    end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1606980623314-0b0a7f6d3f3f?w=800'
  },
  {
    title: 'First Edition Harry Potter Book',
    description: 'Harry Potter and the Philosopher\'s Stone, first edition hardcover. Excellent condition, authenticated.',
    starting_price: 15000,
    current_price: 18500,
    category: 'Books',
    duration: 14,
    end_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'
  },
  {
    title: 'Gaming PC - RTX 4090',
    description: 'High-end gaming PC: Intel i9-14900K, RTX 4090, 64GB DDR5 RAM, 2TB NVMe SSD. Custom water cooling.',
    starting_price: 4000,
    current_price: 4000,
    category: 'Electronics',
    duration: 6,
    end_time: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800'
  },
  {
    title: 'Abstract Art Canvas Painting',
    description: 'Original abstract oil painting by emerging artist. 48x36 inches, vibrant colors, ready to hang.',
    starting_price: 1200,
    current_price: 1600,
    category: 'Art',
    duration: 4,
    end_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800'
  },
  {
    title: 'Fender Stratocaster Guitar',
    description: 'American Professional II Stratocaster, sunburst finish. Perfect condition with hard case included.',
    starting_price: 1500,
    current_price: 1750,
    category: 'Musical Instruments',
    duration: 8,
    end_time: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800'
  },
  {
    title: 'Diamond Engagement Ring',
    description: '2.5 carat round diamond, platinum setting, GIA certified. VS1 clarity, F color grade.',
    starting_price: 12000,
    current_price: 14500,
    category: 'Jewelry',
    duration: 12,
    end_time: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'
  },
  {
    title: 'Leather Chesterfield Sofa',
    description: 'Genuine Italian leather Chesterfield sofa, 3-seater, cognac brown. Excellent condition.',
    starting_price: 2000,
    current_price: 2400,
    category: 'Home & Garden',
    duration: 9,
    end_time: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'
  },
  {
    title: 'Signed Michael Jordan Jersey',
    description: 'Authentic Chicago Bulls #23 jersey signed by Michael Jordan. Certificate of authenticity included.',
    starting_price: 5000,
    current_price: 6800,
    category: 'Sports',
    duration: 11,
    end_time: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1614251055880-2c46b0dba1b3?w=800'
  },
  {
    title: 'Vintage Wine Collection',
    description: '6 bottles of 1990 Château Margaux Bordeaux. Perfect storage conditions, investment grade wine.',
    starting_price: 8000,
    current_price: 9500,
    category: 'Food & Beverage',
    duration: 13,
    end_time: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), // 13 days from now
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800'
  }
];

async function seedDatabase() {
  try {
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Auction.deleteMany({});
    await Bid.deleteMany({});
    await Rating.deleteMany({});

    console.log('👥 Creating users...');
    const users = await User.create(mockUsers);
    console.log(`✅ Created ${users.length} users`);

    // Get sellers and buyers
    const sellers = users.filter(u => u.role === 'seller');
    const buyers = users.filter(u => u.role === 'buyer');

    console.log('🎯 Creating auctions...');
    const auctionsWithSellers = mockAuctions.map((auction, index) => ({
      ...auction,
      seller_id: sellers[index % sellers.length]._id
    }));
    const auctions = await Auction.create(auctionsWithSellers);
    console.log(`✅ Created ${auctions.length} auctions`);

    console.log('💰 Creating bids...');
    const bids = [];
    
    // Create multiple bids for each auction
    for (const auction of auctions) {
      const numBids = Math.floor(Math.random() * 5) + 2; // 2-6 bids per auction
      const startPrice = auction.starting_price;
      const currentPrice = auction.current_price;
      const increment = (currentPrice - startPrice) / numBids;

      for (let i = 0; i < numBids; i++) {
        const bidAmount = startPrice + (increment * (i + 1));
        const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
        
        bids.push({
          auction_id: auction._id,
          buyer_id: randomBuyer._id,
          amount: Math.round(bidAmount),
          bid_time: new Date(Date.now() - (numBids - i) * 24 * 60 * 60 * 1000) // Spread bids over time
        });
      }
    }
    
    await Bid.create(bids);
    console.log(`✅ Created ${bids.length} bids`);

    console.log('⭐ Creating ratings...');
    const ratings = [];
    
    // Create ratings for closed auctions (we'll mark some as closed)
    const closedAuctionIndices = [0, 2, 4, 6]; // Some auctions to mark as closed
    
    for (const index of closedAuctionIndices) {
      const auction = auctions[index];
      
      // Mark auction as closed
      auction.status = 'closed';
      await auction.save();
      
      // Get the highest bidder for this auction
      const auctionBids = bids.filter(b => b.auction_id.toString() === auction._id.toString());
      if (auctionBids.length > 0) {
        const highestBid = auctionBids.reduce((max, bid) => bid.amount > max.amount ? bid : max);
        
        ratings.push({
          auction_id: auction._id,
          buyer_id: highestBid.buyer_id,
          seller_id: auction.seller_id,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          comment: [
            'Great seller! Item exactly as described.',
            'Fast shipping and excellent communication.',
            'Very satisfied with this purchase.',
            'Item arrived in perfect condition.',
            'Professional seller, highly recommended!'
          ][Math.floor(Math.random() * 5)]
        });
      }
    }
    
    await Rating.create(ratings);
    console.log(`✅ Created ${ratings.length} ratings`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length} (${sellers.length} sellers, ${buyers.length} buyers)`);
    console.log(`   Auctions: ${auctions.length} (${closedAuctionIndices.length} closed, ${auctions.length - closedAuctionIndices.length} active)`);
    console.log(`   Bids: ${bids.length}`);
    console.log(`   Ratings: ${ratings.length}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Sellers:');
    sellers.forEach(seller => {
      console.log(`      ${seller.email} / Password123!`);
    });
    console.log('   Buyers:');
    buyers.forEach(buyer => {
      console.log(`      ${buyer.email} / Password123!`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
