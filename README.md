# 🎯 Auctra - Online Auction Platform

![Auctra Banner](https://via.placeholder.com/1200x300/0ea5e9/ffffff?text=Auctra+-+Modern+Auction+Platform)

A modern, real-time online auction system built with React, Node.js, Express, MongoDB, and Socket.IO. Features a clean, glassmorphic UI with smooth animations and essential auction functionality.

> **📢 Now using MongoDB!** Auctra has been migrated from MySQL to MongoDB for better scalability. See [MONGODB_MIGRATION.md](MONGODB_MIGRATION.md) for details.

## ✨ Features

### Core Functionality
- 🔐 **JWT Authentication** - Secure user registration and login
- 👥 **Role-Based Access** - Buyer, Seller, and Admin roles
- 🏷️ **Live Auctions** - Create and manage auctions with real-time updates
- 💰 **Competitive Bidding** - Place bids with validation and real-time notifications
- ⏰ **Timer System** - Automatic auction closure when time expires
- ⭐ **Rating System** - Rate sellers after auction completion
- 📊 **Admin Panel** - User and auction management
- 📱 **Responsive Design** - Works seamlessly on all devices

### Real-Time Features (Socket.IO)
- 🔴 **auction_created** - Instant notification of new auctions
- 📢 **new_bid** - Live bid updates across all clients
- ⏱️ **timer_tick** - Per-second countdown for active auctions

### UI/UX Features
- 🎨 **Glassmorphism Design** - Modern, clean aesthetic
- ✨ **Framer Motion Animations** - Smooth, professional animations
- 🌓 **Dark Theme** - Easy on the eyes
- 📐 **Grid Layouts** - Organized, responsive layouts
- 🎯 **Intuitive Navigation** - Easy to use interface

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js + Express** - Server framework
- **MongoDB + Mongoose** - Database
- **Socket.IO** - Real-time WebSocket server
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Express Validator** - Input validation

### Testing
- **Jest** - Backend testing
- **Supertest** - API testing
- **Vitest** - Frontend testing
- **React Testing Library** - Component testing

## 📁 Project Structure

```
Auctra/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── tests/           # Backend tests
│   ├── utils/           # Utilities (multer config)
│   ├── uploads/         # Uploaded images
│   ├── database.js      # MongoDB connection with Mongoose
│   ├── server.js        # Express + Socket.IO server
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── context/     # React Context (Auth, Socket)
    │   ├── pages/       # Page components
    │   ├── services/    # API service layer
    │   ├── test/        # Frontend tests
    │   ├── App.jsx      # Main app component
    │   ├── main.jsx     # Entry point
    │   └── index.css    # Global styles
    ├── public/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Auctra
```

### 2. Database Setup
```bash
# Start MongoDB
mongosh

# Database will be created automatically when you run the app
```

The schema will be automatically created when you start the backend server.

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=auctra_db
# JWT_SECRET=your_secret_key
# PORT=5000

# Start backend server
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit if needed (defaults work for local development)
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000

# Start frontend
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Socket.IO: ws://localhost:5000

## 👤 Creating Admin User

To create an admin user, you need to manually insert into the database:

```sql
-- First, register a normal user through the app, then:
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Auction Endpoints
```
GET    /api/auctions         - Get all auctions (with filters)
GET    /api/auctions/:id     - Get auction by ID
POST   /api/auctions         - Create auction (seller only)
GET    /api/auctions/:id/bids - Get bids for auction
DELETE /api/auctions/:id     - Delete auction (admin only)
```

### Bid Endpoints
```
POST   /api/bids             - Place bid (buyer only)
GET    /api/bids/my-bids     - Get user's bids (buyer only)
```

### Rating Endpoints
```
POST   /api/ratings          - Rate seller (buyer only)
GET    /api/ratings/:userId  - Get seller ratings
```

### Admin Endpoints
```
GET    /api/admin/users      - Get all users
GET    /api/admin/auctions   - Get all auctions
PUT    /api/admin/users/:id/block - Block/unblock user
DELETE /api/admin/auctions/:id - Delete auction
```

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
npm test

# With coverage
npm test -- --coverage
```

### Frontend Tests
```bash
cd frontend
npm test

# Watch mode
npm test -- --watch
```

## 🎯 Usage Guide

### As a Buyer
1. Register with role "buyer"
2. Browse active auctions on the home page
3. Click on an auction to view details
4. Place bids (must be higher than current price)
5. Monitor your bids in the dashboard
6. Rate sellers after auction ends

### As a Seller
1. Register with role "seller"
2. Create auctions from your dashboard
3. Upload images, set starting price and duration
4. Monitor bids and auction status
5. View your auction history

### As an Admin
1. Access admin panel from navigation
2. View all users and auctions
3. Block/unblock users
4. Delete inappropriate auctions
5. Monitor platform statistics

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected routes and API endpoints
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ File upload validation
- ✅ CORS configuration
- ✅ Error handling middleware

## 🎨 UI Components

- **Button** - Animated button with variants
- **Input** - Styled input with icons and validation
- **Card** - Glassmorphic container
- **AuctionCard** - Auction display card
- **Timer** - Real-time countdown
- **Navbar** - Responsive navigation
- **Toast** - Notification system
- **ProtectedRoute** - Route authentication

## 📦 Deployment

### Backend (Node.js)
Deploy to platforms like:
- Railway
- Render
- Heroku
- DigitalOcean

### Frontend (React)
Deploy to platforms like:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### Database
Use managed MongoDB services:
- PlanetScale
- AWS RDS
- DigitalOcean Managed Database

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Verify credentials in .env
# Ensure database exists
```

### Socket.IO Connection Issues
```bash
# Check CORS settings in backend
# Verify frontend SOCKET_URL
# Check firewall settings
```

### File Upload Issues
```bash
# Ensure uploads/ directory exists
# Check file permissions
# Verify MAX_FILE_SIZE in .env
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for modern auction experiences

## 🙏 Acknowledgments

- Inspired by EASYBID and AUDEASE projects
- Icons by Lucide
- UI inspiration from modern web design trends

---

**Happy Bidding! 🎉**
