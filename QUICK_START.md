# 🚀 Quick Start Guide - Auctra

Get Auctra up and running in 5 minutes!

## Prerequisites Check
```bash
node --version  # Should be 18+
npm --version   # Should be 9+
mongosh --version # Should be 2.x+
```

## 1. Database Setup (2 minutes)
```bash
# Start MongoDB
sudo systemctl start mongod  # Linux
# or
brew services start mongodb-community   # macOS

# Verify MongoDB is running
mongosh
```

MongoDB will automatically create the database when the app runs. No manual creation needed!

## 2. Backend Setup (1 minute)
```bash
cd backend
npm install
cp .env.example .env

# Edit .env - Update these:
# MONGODB_URI=mongodb://localhost:27017/auctra_db
# JWT_SECRET=any_random_string

npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
⏰ Auction timer started
🚀 Server running on port 5000
```

## 3. Frontend Setup (1 minute)
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 4. Test It! (1 minute)

1. **Open** http://localhost:5173
2. **Register** as a seller
3. **Create** an auction
4. **Register** another user as a buyer (use incognito/private window)
5. **Place** a bid
6. **Watch** real-time updates! 🎉

## Quick Test Commands

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## Default Ports
- Frontend: `5173`
- Backend: `5000`
- Database: `3306`

## Common Issues

### ❌ "Cannot connect to MongoDB"
```bash
# Check MySQL is running
sudo systemctl status mysql

# Reset root password if needed
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
FLUSH PRIVILEGES;
```

### ❌ "Port 5000 already in use"
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

### ❌ "Socket connection failed"
- Make sure backend is running first
- Check `VITE_SOCKET_URL` in frontend/.env

## Creating Admin User

After registering normally:
```sql
mongosh auctra_db
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## Next Steps

✅ Read the full [README.md](./README.md)  
✅ Check [API Documentation](./DOCS.md)  
✅ Review [Testing Guide](./TESTING.md)  

## Need Help?

- Check the troubleshooting section in README.md
- Review error messages in terminal
- Ensure all dependencies are installed

---

**You're all set! Start bidding! 🎯**
