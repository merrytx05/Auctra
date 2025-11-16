# 📖 API Documentation - Auctra

Complete API reference for the Auctra backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"  // or "seller"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

### Get Current User
```http
GET /auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "buyer",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🏷️ Auction Endpoints

### Get All Auctions
```http
GET /auctions?search=<query>&status=<status>&limit=<limit>&offset=<offset>
```

**Query Parameters:**
- `search` (optional) - Search in title/description
- `status` (optional) - Filter by "active" or "closed"
- `limit` (optional) - Number of results (default: 20)
- `offset` (optional) - Pagination offset (default: 0)

**Response:** `200 OK`
```json
{
  "auctions": [
    {
      "id": 1,
      "seller_id": 2,
      "title": "Vintage Camera",
      "description": "Classic film camera in excellent condition",
      "starting_price": "100.00",
      "current_price": "150.00",
      "image_url": "/uploads/auction-123.jpg",
      "duration": 3600,
      "start_time": "2024-01-15T10:00:00.000Z",
      "end_time": "2024-01-15T11:00:00.000Z",
      "status": "active",
      "seller_username": "jane_seller",
      "bid_count": 5,
      "highest_bid": "150.00"
    }
  ],
  "count": 1
}
```

### Get Auction by ID
```http
GET /auctions/:id
```

**Response:** `200 OK`
```json
{
  "auction": {
    "id": 1,
    "seller_id": 2,
    "title": "Vintage Camera",
    "description": "Classic film camera",
    "starting_price": "100.00",
    "current_price": "150.00",
    "image_url": "/uploads/auction-123.jpg",
    "status": "active",
    "seller_username": "jane_seller",
    "seller_email": "jane@example.com",
    "bid_count": 5,
    "highest_bid": "150.00"
  }
}
```

### Create Auction (Seller Only)
```http
POST /auctions
```

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (form-data):**
```
title: "Vintage Camera"
description: "Classic film camera"
startingPrice: 100
duration: 3600
image: <file>
```

**Response:** `201 Created`
```json
{
  "message": "Auction created successfully",
  "auction": {
    "id": 1,
    "seller_id": 2,
    "title": "Vintage Camera",
    ...
  }
}
```

### Get Seller's Auctions
```http
GET /auctions/seller/my-auctions
```

**Headers:** `Authorization: Bearer <token>` (Seller role)

**Response:** `200 OK`
```json
{
  "auctions": [...],
  "count": 5
}
```

### Get Auction Bids
```http
GET /auctions/:id/bids
```

**Response:** `200 OK`
```json
{
  "bids": [
    {
      "id": 1,
      "auction_id": 1,
      "buyer_id": 3,
      "amount": "150.00",
      "created_at": "2024-01-15T10:15:00.000Z",
      "buyer_username": "john_buyer"
    }
  ],
  "count": 1
}
```

### Delete Auction (Admin Only)
```http
DELETE /auctions/:id
```

**Headers:** `Authorization: Bearer <token>` (Admin role)

**Response:** `200 OK`
```json
{
  "message": "Auction deleted successfully"
}
```

---

## 💰 Bid Endpoints

### Place Bid (Buyer Only)
```http
POST /bids
```

**Headers:** `Authorization: Bearer <token>` (Buyer role)

**Request Body:**
```json
{
  "auctionId": 1,
  "amount": 150.50
}
```

**Response:** `201 Created`
```json
{
  "message": "Bid placed successfully",
  "bid": {
    "id": 1,
    "auction_id": 1,
    "buyer_id": 3,
    "amount": 150.50,
    "buyer_username": "john_buyer"
  }
}
```

**Error Responses:**
```json
// 400 - Bid too low
{
  "message": "Bid must be higher than current price of $150.00"
}

// 400 - Auction closed
{
  "message": "Auction is not active"
}

// 400 - Own auction
{
  "message": "Cannot bid on your own auction"
}
```

### Get My Bids (Buyer Only)
```http
GET /bids/my-bids
```

**Headers:** `Authorization: Bearer <token>` (Buyer role)

**Response:** `200 OK`
```json
{
  "bids": [
    {
      "id": 1,
      "auction_id": 1,
      "buyer_id": 3,
      "amount": "150.00",
      "created_at": "2024-01-15T10:15:00.000Z",
      "auction_title": "Vintage Camera",
      "auction_status": "active",
      "auction_end_time": "2024-01-15T11:00:00.000Z",
      "auction_image": "/uploads/auction-123.jpg",
      "highest_bid": "200.00"
    }
  ],
  "count": 1
}
```

---

## ⭐ Rating Endpoints

### Create Rating (Buyer Only)
```http
POST /ratings
```

**Headers:** `Authorization: Bearer <token>` (Buyer role)

**Request Body:**
```json
{
  "sellerId": 2,
  "auctionId": 1,
  "rating": 5,
  "comment": "Great seller! Fast shipping."
}
```

**Response:** `201 Created`
```json
{
  "message": "Rating submitted successfully",
  "ratingId": 1
}
```

### Get Seller Ratings
```http
GET /ratings/:userId
```

**Response:** `200 OK`
```json
{
  "ratings": [
    {
      "id": 1,
      "seller_id": 2,
      "buyer_id": 3,
      "auction_id": 1,
      "rating": 5,
      "comment": "Great seller!",
      "created_at": "2024-01-15T12:00:00.000Z",
      "buyer_username": "john_buyer",
      "auction_title": "Vintage Camera"
    }
  ],
  "stats": {
    "totalRatings": 10,
    "averageRating": "4.80",
    "breakdown": {
      "fiveStar": 8,
      "fourStar": 2,
      "threeStar": 0,
      "twoStar": 0,
      "oneStar": 0
    }
  }
}
```

---

## 👑 Admin Endpoints

All admin endpoints require Admin role.

### Get All Users
```http
GET /admin/users
```

**Headers:** `Authorization: Bearer <token>` (Admin role)

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "buyer",
      "is_blocked": false,
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Get All Auctions
```http
GET /admin/auctions
```

**Headers:** `Authorization: Bearer <token>` (Admin role)

**Response:** `200 OK`
```json
{
  "auctions": [...],
  "count": 10
}
```

### Block/Unblock User
```http
PUT /admin/users/:id/block
```

**Headers:** `Authorization: Bearer <token>` (Admin role)

**Request Body:**
```json
{
  "isBlocked": true
}
```

**Response:** `200 OK`
```json
{
  "message": "User blocked successfully"
}
```

### Delete Auction
```http
DELETE /admin/auctions/:id
```

**Headers:** `Authorization: Bearer <token>` (Admin role)

**Response:** `200 OK`
```json
{
  "message": "Auction deleted successfully"
}
```

---

## 🔌 Socket.IO Events

### Client → Server
```javascript
// Connection
socket.connect()
```

### Server → Client

#### auction_created
Emitted when a new auction is created.
```javascript
socket.on('auction_created', (auction) => {
  console.log('New auction:', auction);
});
```

#### new_bid
Emitted when a new bid is placed.
```javascript
socket.on('new_bid', ({ auctionId, highestBid, buyerUsername }) => {
  console.log(`New bid of $${highestBid} on auction ${auctionId}`);
});
```

#### timer_tick
Emitted every second for active auctions.
```javascript
socket.on('timer_tick', ({ auctionId, timeLeft, status }) => {
  console.log(`Auction ${auctionId}: ${timeLeft}s remaining`);
});
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided, authorization denied"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Required role: seller"
}
```

### 404 Not Found
```json
{
  "message": "Auction not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "stack": "..." // Only in development
}
```

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production:
- Authentication endpoints: 5 requests/minute
- Bid placement: 10 requests/minute
- General API: 100 requests/minute

## CORS

Configure allowed origins in `backend/server.js`:
```javascript
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
})
```

---

**For more information, check the source code or contact the development team.**
