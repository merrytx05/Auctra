# 🗄️ MongoDB Quick Reference for Auctra

## Connection

```bash
# Connect to local MongoDB
mongosh

# Connect to specific database
mongosh auctra_db

# Connect with URI
mongosh "mongodb://localhost:27017/auctra_db"
```

## Database Commands

```javascript
// Show all databases
show dbs

// Use specific database
use auctra_db

// Show current database
db

// Drop database (careful!)
db.dropDatabase()
```

## Collection Commands

```javascript
// Show all collections
show collections

// List: users, auctions, bids, ratings

// Get collection stats
db.users.stats()
```

## Query Commands

### Users
```javascript
// Count all users
db.users.countDocuments()

// Find all users
db.users.find()

// Find with pretty print
db.users.find().pretty()

// Find by email
db.users.findOne({ email: "user@example.com" })

// Find by role
db.users.find({ role: "seller" })

// Find blocked users
db.users.find({ is_blocked: true })

// Find and limit
db.users.find().limit(5)
```

### Auctions
```javascript
// Count all auctions
db.auctions.countDocuments()

// Find active auctions
db.auctions.find({ status: "active" })

// Find by seller
db.auctions.find({ seller_id: ObjectId("...") })

// Find expensive auctions
db.auctions.find({ current_price: { $gt: 100 } })

// Sort by price (descending)
db.auctions.find().sort({ current_price: -1 })

// Find auctions ending soon
db.auctions.find({
  end_time: { $lt: new Date(Date.now() + 3600000) }
})
```

### Bids
```javascript
// Count bids for auction
db.bids.countDocuments({ auction_id: ObjectId("...") })

// Find highest bid for auction
db.bids.find({ auction_id: ObjectId("...") })
  .sort({ amount: -1 })
  .limit(1)

// Find bids by buyer
db.bids.find({ buyer_id: ObjectId("...") })

// Average bid amount
db.bids.aggregate([
  { $group: { _id: null, avg: { $avg: "$amount" } } }
])
```

### Ratings
```javascript
// Find ratings for seller
db.ratings.find({ seller_id: ObjectId("...") })

// Calculate average rating
db.ratings.aggregate([
  { $match: { seller_id: ObjectId("...") } },
  { $group: { 
    _id: null, 
    avgRating: { $avg: "$rating" },
    count: { $sum: 1 }
  }}
])

// Rating distribution
db.ratings.aggregate([
  { $match: { seller_id: ObjectId("...") } },
  { $group: { 
    _id: "$rating", 
    count: { $sum: 1 }
  }},
  { $sort: { _id: -1 } }
])
```

## Update Commands

```javascript
// Update user
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { is_blocked: false } }
)

// Update many
db.auctions.updateMany(
  { status: "active", end_time: { $lt: new Date() } },
  { $set: { status: "closed" } }
)

// Increment price
db.auctions.updateOne(
  { _id: ObjectId("...") },
  { $inc: { current_price: 10 } }
)
```

## Delete Commands

```javascript
// Delete one document
db.users.deleteOne({ email: "test@example.com" })

// Delete many
db.bids.deleteMany({ auction_id: ObjectId("...") })

// Delete all documents in collection (careful!)
db.ratings.deleteMany({})
```

## Index Commands

```javascript
// List indexes
db.users.getIndexes()

// Create index
db.auctions.createIndex({ status: 1, end_time: 1 })

// Drop index
db.auctions.dropIndex("status_1_end_time_1")

// Drop all indexes (except _id)
db.users.dropIndexes()
```

## Aggregation Examples

### Top Bidders
```javascript
db.bids.aggregate([
  { $group: {
    _id: "$buyer_id",
    totalBids: { $sum: 1 },
    totalAmount: { $sum: "$amount" }
  }},
  { $sort: { totalAmount: -1 } },
  { $limit: 10 }
])
```

### Active Auctions by Seller
```javascript
db.auctions.aggregate([
  { $match: { status: "active" } },
  { $group: {
    _id: "$seller_id",
    count: { $sum: 1 },
    totalValue: { $sum: "$current_price" }
  }},
  { $sort: { count: -1 } }
])
```

### Auction Statistics
```javascript
db.auctions.aggregate([
  { $group: {
    _id: "$status",
    count: { $sum: 1 },
    avgPrice: { $avg: "$current_price" },
    totalValue: { $sum: "$current_price" }
  }}
])
```

## Useful Filters

```javascript
// Greater than
{ amount: { $gt: 50 } }

// Less than
{ amount: { $lt: 100 } }

// Range
{ amount: { $gte: 50, $lte: 100 } }

// Not equal
{ status: { $ne: "closed" } }

// In array
{ role: { $in: ["buyer", "seller"] } }

// Regex (case insensitive)
{ title: { $regex: "laptop", $options: "i" } }

// Exists
{ image_url: { $exists: true } }

// And
{ $and: [
  { status: "active" },
  { current_price: { $gt: 100 } }
]}

// Or
{ $or: [
  { status: "active" },
  { status: "closed" }
]}
```

## Backup & Restore

```bash
# Backup database
mongodump --db=auctra_db --out=/backup/

# Restore database
mongorestore --db=auctra_db /backup/auctra_db/

# Export collection to JSON
mongoexport --db=auctra_db --collection=users --out=users.json

# Import collection from JSON
mongoimport --db=auctra_db --collection=users --file=users.json
```

## Performance Tips

```javascript
// Use indexes
db.auctions.createIndex({ status: 1, end_time: 1 })

// Use .lean() in Mongoose for read-only queries
Auction.find().lean()

// Limit fields
db.users.find({}, { username: 1, email: 1 })

// Use pagination
db.auctions.find().skip(20).limit(20)

// Explain query
db.auctions.find({ status: "active" }).explain("executionStats")
```

## Admin Commands

```javascript
// Server status
db.serverStatus()

// Current operations
db.currentOp()

// Database stats
db.stats()

// Collection size
db.auctions.stats().size

// Repair database
db.repairDatabase()
```

## MongoDB Compass

Download GUI tool from: https://www.mongodb.com/products/compass

Visual interface for:
- Browsing collections
- Running queries
- Creating indexes
- Viewing performance
- Schema analysis

## Common Tasks

### Find User by Username
```javascript
db.users.findOne({ username: "john_doe" })
```

### Get All Bids for Auction
```javascript
db.bids.find({ auction_id: ObjectId("...") }).sort({ amount: -1 })
```

### Close Expired Auctions
```javascript
db.auctions.updateMany(
  { 
    status: "active",
    end_time: { $lt: new Date() }
  },
  { $set: { status: "closed" } }
)
```

### Delete Test Data
```javascript
db.users.deleteMany({ email: { $regex: "test" } })
db.auctions.deleteMany({ title: { $regex: "test" } })
```

### Get Seller Statistics
```javascript
const sellerId = ObjectId("...")

// Total auctions
db.auctions.countDocuments({ seller_id: sellerId })

// Active auctions
db.auctions.countDocuments({ 
  seller_id: sellerId,
  status: "active"
})

// Average rating
db.ratings.aggregate([
  { $match: { seller_id: sellerId } },
  { $group: {
    _id: null,
    avg: { $avg: "$rating" },
    count: { $sum: 1 }
  }}
])
```

## Quick Cleanup

```javascript
// Remove all test users
db.users.deleteMany({ email: { $regex: "@test.com" } })

// Remove closed auctions older than 30 days
db.auctions.deleteMany({
  status: "closed",
  end_time: { $lt: new Date(Date.now() - 30*24*60*60*1000) }
})

// Remove orphaned bids
const auctionIds = db.auctions.distinct("_id")
db.bids.deleteMany({ auction_id: { $nin: auctionIds } })
```

---

**Tip**: Save frequently used queries as functions in mongosh:
```javascript
function activeAuctions() {
  return db.auctions.find({ status: "active" }).pretty()
}

// Use it:
activeAuctions()
```
