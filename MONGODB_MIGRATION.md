# 🔄 MongoDB Migration Guide

Auctra has been migrated from MySQL to MongoDB for improved scalability and flexibility.

## 🆕 What Changed

### Database
- **Before**: MySQL with raw SQL queries
- **After**: MongoDB with Mongoose ODM

### Models
- **Before**: Static class methods with SQL queries
- **After**: Mongoose schemas with built-in methods

### IDs
- **Before**: Auto-increment integers (1, 2, 3...)
- **After**: MongoDB ObjectIds (`_id` field)

### Relationships
- **Before**: Foreign keys with JOINs
- **After**: References with `.populate()`

---

## 📦 Installation

### 1. Install MongoDB

**Windows:**
```bash
# Download from MongoDB.com
https://www.mongodb.com/try/download/community
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Verify Installation

```bash
mongosh --version
# Should show v2.x.x or higher
```

### 3. Start MongoDB

```bash
# Check if running
mongosh

# If not running:
# Windows: Start MongoDB service from Services
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

---

## ⚙️ Configuration

### Update .env File

```env
# OLD (MySQL)
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=auctra_db
# DB_PORT=3306

# NEW (MongoDB)
MONGODB_URI=mongodb://localhost:27017/auctra_db
```

### For MongoDB Atlas (Cloud)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auctra_db?retryWrites=true&w=majority
```

---

## 🔄 Database Schema

MongoDB automatically creates collections when you first insert data. No manual schema creation needed!

### Collections Created:
- `users` - User accounts
- `auctions` - Auction listings
- `bids` - Bid records
- `ratings` - Seller ratings

### Indexes:
Indexes are automatically created by Mongoose schemas:
- `users`: email, username, role
- `auctions`: seller_id, status, end_time
- `bids`: auction_id, buyer_id, amount
- `ratings`: seller_id, buyer_id, auction_id

---

## 🚀 Running the Application

### 1. Install Dependencies

```bash
cd backend
npm install
```

The `package.json` now uses `mongoose` instead of `mysql2`.

### 2. Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
⏰ Auction timer started
🚀 Server running on port 5000
```

---

## 📊 Data Migration (Optional)

If you have existing MySQL data, here's how to migrate:

### Export from MySQL

```javascript
// migration/export-mysql.js
const mysql = require('mysql2/promise');
const fs = require('fs');

const exportData = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'auctra_db'
  });

  const [users] = await connection.query('SELECT * FROM users');
  const [auctions] = await connection.query('SELECT * FROM auctions');
  const [bids] = await connection.query('SELECT * FROM bids');
  const [ratings] = await connection.query('SELECT * FROM ratings');

  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  fs.writeFileSync('auctions.json', JSON.stringify(auctions, null, 2));
  fs.writeFileSync('bids.json', JSON.stringify(bids, null, 2));
  fs.writeFileSync('ratings.json', JSON.stringify(ratings, null, 2));

  console.log('✅ Data exported');
  await connection.end();
};

exportData();
```

### Import to MongoDB

```javascript
// migration/import-mongodb.js
const mongoose = require('mongoose');
const fs = require('fs');
const User = require('../models/User');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const Rating = require('../models/Rating');

const importData = async () => {
  await mongoose.connect('mongodb://localhost:27017/auctra_db');

  const users = JSON.parse(fs.readFileSync('users.json'));
  const auctions = JSON.parse(fs.readFileSync('auctions.json'));
  const bids = JSON.parse(fs.readFileSync('bids.json'));
  const ratings = JSON.parse(fs.readFileSync('ratings.json'));

  // Create user ID mapping
  const userIdMap = {};
  for (const user of users) {
    const newUser = await User.create({
      username: user.username,
      email: user.email,
      password: user.password, // Already hashed
      role: user.role,
      is_blocked: user.is_blocked
    });
    userIdMap[user.id] = newUser._id;
  }

  // Import auctions
  const auctionIdMap = {};
  for (const auction of auctions) {
    const newAuction = await Auction.create({
      seller_id: userIdMap[auction.seller_id],
      title: auction.title,
      description: auction.description,
      starting_price: auction.starting_price,
      current_price: auction.current_price,
      image_url: auction.image_url,
      duration: auction.duration,
      start_time: auction.start_time,
      end_time: auction.end_time,
      status: auction.status
    });
    auctionIdMap[auction.id] = newAuction._id;
  }

  // Import bids
  for (const bid of bids) {
    await Bid.create({
      auction_id: auctionIdMap[bid.auction_id],
      buyer_id: userIdMap[bid.buyer_id],
      amount: bid.amount,
      createdAt: bid.created_at
    });
  }

  // Import ratings
  for (const rating of ratings) {
    await Rating.create({
      seller_id: userIdMap[rating.seller_id],
      buyer_id: userIdMap[rating.buyer_id],
      auction_id: auctionIdMap[rating.auction_id],
      rating: rating.rating,
      comment: rating.comment,
      createdAt: rating.created_at
    });
  }

  console.log('✅ Data imported to MongoDB');
  await mongoose.connection.close();
};

importData();
```

Run migration:
```bash
node migration/export-mysql.js
node migration/import-mongodb.js
```

---

## 🔍 MongoDB Commands

### Using MongoDB Shell (mongosh)

```bash
# Connect to database
mongosh auctra_db

# Show collections
show collections

# Count documents
db.users.countDocuments()
db.auctions.countDocuments()
db.bids.countDocuments()

# Find documents
db.users.find().limit(5)
db.auctions.find({ status: 'active' })

# Find one by ID
db.users.findOne({ _id: ObjectId("...") })

# Update document
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { is_blocked: false } }
)

# Delete document
db.auctions.deleteOne({ _id: ObjectId("...") })

# Drop collection (careful!)
db.bids.drop()

# Drop entire database (careful!)
db.dropDatabase()
```

---

## 🆚 Query Comparison

### Find User by Email

**MySQL:**
```javascript
const sql = 'SELECT * FROM users WHERE email = ?';
const results = await query(sql, [email]);
return results[0];
```

**MongoDB:**
```javascript
const user = await User.findOne({ email });
return user;
```

### Get Auctions with Seller Info

**MySQL:**
```javascript
const sql = `
  SELECT a.*, u.username as seller_username
  FROM auctions a
  LEFT JOIN users u ON a.seller_id = u.id
  WHERE a.status = 'active'
`;
const results = await query(sql);
```

**MongoDB:**
```javascript
const auctions = await Auction.find({ status: 'active' })
  .populate('seller_id', 'username');
```

### Count Bids for Auction

**MySQL:**
```javascript
const sql = 'SELECT COUNT(*) as count FROM bids WHERE auction_id = ?';
const results = await query(sql, [auctionId]);
return results[0].count;
```

**MongoDB:**
```javascript
const count = await Bid.countDocuments({ auction_id: auctionId });
return count;
```

---

## 🛠️ Development Tips

### 1. Use MongoDB Compass
Visual GUI for MongoDB:
https://www.mongodb.com/products/compass

### 2. Enable Debug Logging
```javascript
// Add to server.js
mongoose.set('debug', true);
```

### 3. Handle ObjectId Conversion
```javascript
const mongoose = require('mongoose');

// Convert string to ObjectId
const objectId = new mongoose.Types.ObjectId(idString);

// Check if valid ObjectId
if (mongoose.Types.ObjectId.isValid(id)) {
  // Valid
}
```

---

## 🐛 Troubleshooting

### "MongooseServerSelectionError: connect ECONNREFUSED"
**Solution**: MongoDB isn't running
```bash
# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### "Cannot find module 'mongoose'"
**Solution**: Install dependencies
```bash
cd backend
npm install
```

### "ValidationError: Path `username` is required"
**Solution**: Check your request body contains all required fields

### Indexes not created
**Solution**: Drop and recreate
```bash
mongosh auctra_db
db.users.dropIndexes()
# Restart server to recreate indexes
```

---

## 📚 Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB University](https://university.mongodb.com/) - Free courses
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Free cloud hosting

---

## ✅ Verification Checklist

- [ ] MongoDB installed and running
- [ ] `mongosh` command works
- [ ] `.env` updated with `MONGODB_URI`
- [ ] `npm install` completed
- [ ] Backend starts without errors
- [ ] Can register new user
- [ ] Can create auction
- [ ] Can place bid
- [ ] Real-time updates work

---

**Migration complete! 🎉 Your Auctra app now runs on MongoDB!**
