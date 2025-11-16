# ✅ Setup Checklist - Auctra with MongoDB

Follow this checklist to get Auctra running on your system.

## Prerequisites

### 1. Node.js Installation
```bash
node --version  # Should be v16+ or v18+
npm --version   # Should be v8+
```

**Not installed?**
- Download from: https://nodejs.org/
- Choose LTS version

### 2. MongoDB Installation

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
mongosh --version  # Verify installation
```

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Install MongoDB Community Server
- Start MongoDB service from Services app
- Add MongoDB to PATH

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
mongosh --version  # Verify installation
```

### 3. Git (Optional)
```bash
git --version
```

---

## Setup Steps

### Step 1: Download/Clone Project ✅

```bash
# If using git
git clone <repository-url>
cd Auctra

# If downloaded as ZIP
unzip Auctra.zip
cd Auctra
```

### Step 2: Backend Setup ✅

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings
# Required variables:
# - MONGODB_URI=mongodb://localhost:27017/auctra_db
# - JWT_SECRET=your_secret_key_here
# - FRONTEND_URL=http://localhost:5173
```

**Edit `.env` file:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/auctra_db
JWT_SECRET=change_this_to_a_random_secret_key
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173
```

### Step 3: Frontend Setup ✅

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env

# Edit if needed
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000
```

### Step 4: Verify MongoDB ✅

```bash
# Connect to MongoDB
mongosh

# You should see:
# Current Mongosh version...
# Connecting to: mongodb://127.0.0.1:27017/...
# test>

# Type 'exit' to quit
exit
```

### Step 5: Start Backend ✅

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected: localhost
⏰ Auction timer started
🚀 Server running on port 5000
📡 Socket.IO enabled
🌍 Environment: development
```

### Step 6: Start Frontend ✅

**Open a new terminal window:**

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 7: Test the Application ✅

1. **Open browser**: http://localhost:5173

2. **Register a new user:**
   - Click "Get Started" or "Register"
   - Fill in: Username, Email, Password, Role (Buyer/Seller)
   - Click "Register"

3. **Login:**
   - Use the credentials you just created
   - You should see the home page

4. **Create an auction (Seller):**
   - Register/Login as seller
   - Click "Create Auction"
   - Fill in details, upload image
   - Click "Create"

5. **Place a bid (Buyer):**
   - Register/Login as buyer
   - View an active auction
   - Enter bid amount
   - Click "Place Bid"

6. **Verify real-time updates:**
   - Open two browser windows
   - Create auction in one window
   - Should appear in other window instantly
   - Place bid in one window
   - Should update in other window

---

## Troubleshooting

### ❌ "Cannot connect to MongoDB"

**Check if MongoDB is running:**
```bash
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Windows
# Check Services app for "MongoDB Server"
```

**Start MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start from Services app
```

**Test connection:**
```bash
mongosh
```

### ❌ "Module not found" errors

**Reinstall dependencies:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Port 5000 already in use"

**Kill the process:**
```bash
# Find process
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill it
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in backend/.env
PORT=5001
```

### ❌ "Port 5173 already in use"

**Kill the process or change port:**
```bash
# Frontend uses Vite, change in vite.config.js:
server: {
  port: 5174
}
```

### ❌ CORS errors

**Check backend .env:**
```env
FRONTEND_URL=http://localhost:5173
```

**Check frontend .env:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### ❌ Images not uploading

**Check uploads folder exists:**
```bash
cd backend
mkdir -p uploads
```

**Check permissions:**
```bash
chmod 755 uploads
```

---

## Quick Commands Reference

### Backend
```bash
cd backend
npm run dev        # Start development server
npm start          # Start production server
npm test           # Run tests
```

### Frontend
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### MongoDB
```bash
mongosh                    # Connect to MongoDB
mongosh auctra_db          # Connect to specific database
show collections           # List collections
db.users.find().limit(5)   # View users
```

---

## Next Steps

### Create Admin User

```javascript
// In mongosh:
use auctra_db

db.users.insertOne({
  username: "admin",
  email: "admin@auctra.com",
  password: "$2b$10$YourHashedPasswordHere",  // Hash using bcrypt
  role: "admin",
  is_blocked: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or create via API:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@auctra.com",
    "password": "securepassword",
    "role": "admin"
  }'
```

### Add Sample Data

See `MONGODB_COMMANDS.md` for scripts to add test auctions, bids, and ratings.

### Deploy to Production

See `DEPLOYMENT.md` for:
- MongoDB Atlas setup (free tier)
- Railway/Render backend deployment
- Vercel/Netlify frontend deployment

---

## ✅ Final Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB installed and running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] `.env` files configured
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:5173
- [ ] Can register a user
- [ ] Can login
- [ ] Can create auction (as seller)
- [ ] Can place bid (as buyer)
- [ ] Real-time updates work
- [ ] Images upload correctly

---

## 📚 Documentation

- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **MongoDB Guide**: [MONGODB_MIGRATION.md](MONGODB_MIGRATION.md)
- **MongoDB Commands**: [MONGODB_COMMANDS.md](MONGODB_COMMANDS.md)
- **API Documentation**: [API_DOCS.md](API_DOCS.md)
- **Testing Guide**: [TESTING.md](TESTING.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🎉 Success!

Your Auctra auction platform is now running!

**Default URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

**Need help?** Check the documentation files or troubleshooting section above.
