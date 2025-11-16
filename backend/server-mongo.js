const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const Auction = require('./models/Auction');

// Import routes
const authRoutes = require('./routes/auth');
const auctionRoutes = require('./routes/auctions');
const bidRoutes = require('./routes/bids');
const ratingRoutes = require('./routes/ratings');
const adminRoutes = require('./routes/admin');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make io available to routes
app.set('io', io);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Auctra API Server - MongoDB Edition' });
});

app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Timer loop for auctions
let timerInterval;

const startAuctionTimer = async () => {
  timerInterval = setInterval(async () => {
    try {
      // Get all active auctions
      const activeAuctions = await Auction.find({
        status: 'active',
        end_time: { $gt: new Date() }
      }).select('_id end_time');

      for (const auction of activeAuctions) {
        const now = new Date();
        const timeLeft = Math.floor((auction.end_time - now) / 1000);

        if (timeLeft <= 0) {
          // Auction has ended
          await Auction.findByIdAndUpdate(auction._id, { status: 'closed' });
          console.log(`⏰ Auction #${auction._id} has ended`);
          
          // Emit final timer tick
          io.emit('timer_tick', {
            auctionId: auction._id,
            timeLeft: 0,
            status: 'closed'
          });
        } else {
          // Emit timer tick
          io.emit('timer_tick', {
            auctionId: auction._id,
            timeLeft,
            status: 'active'
          });
        }
      }
    } catch (error) {
      console.error('Timer error:', error);
    }
  }, 1000); // Run every second
};

// Initialize database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start auction timer
    startAuctionTimer();
    console.log('⏰ Auction timer started');

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.IO enabled`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  clearInterval(timerInterval);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  clearInterval(timerInterval);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startServer();

module.exports = { app, server, io };
