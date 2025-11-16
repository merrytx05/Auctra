#!/bin/bash

# Auctra MongoDB Setup and Test Script

echo "========================================="
echo "  AUCTRA MONGODB SETUP - COMPLETE TEST"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check MongoDB
echo "Step 1: Checking MongoDB..."
if mongosh --eval "db.version()" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
    MONGO_VERSION=$(mongosh --eval "db.version()" --quiet)
    echo "   Version: $MONGO_VERSION"
else
    echo -e "${RED}❌ MongoDB is not running${NC}"
    echo "   Please start MongoDB first"
    exit 1
fi
echo ""

# Step 2: Check Backend Setup
echo "Step 2: Checking Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Creating .env file...${NC}"
    cp .env.example .env
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Installing dependencies...${NC}"
    npm install > /dev/null 2>&1
fi

if [ ! -d "uploads" ]; then
    mkdir -p uploads
fi

echo -e "${GREEN}✅ Backend setup complete${NC}"
echo ""

# Step 3: Check Frontend Setup
echo "Step 3: Checking Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Installing dependencies...${NC}"
    npm install > /dev/null 2>&1
fi

echo -e "${GREEN}✅ Frontend setup complete${NC}"
echo ""

# Step 4: Test MongoDB Connection
echo "Step 4: Testing MongoDB Connection..."
cd ../backend

cat > test-mongo.js << 'EOF'
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connection Successful');
    console.log('   Database:', mongoose.connection.name);
    console.log('   Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ MongoDB Connection Failed');
    console.log('   Error:', err.message);
    process.exit(1);
  });
EOF

node test-mongo.js
rm test-mongo.js
echo ""

# Step 5: Summary
echo "========================================="
echo "  SETUP COMPLETE! 🎉"
echo "========================================="
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  node server.js"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "========================================="
