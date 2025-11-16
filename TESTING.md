# 🧪 Testing Guide - Auctra

Complete testing documentation for both backend and frontend.

## Test Coverage Goals

- Backend: >80% code coverage
- Frontend: >70% code coverage
- All critical paths tested
- Real-time features tested

---

## 🔧 Backend Testing

### Setup

```bash
cd backend
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- auth.test.js

# Watch mode
npm test -- --watch
```

### Test Structure

```
backend/tests/
├── auth.test.js       # Authentication tests
├── auctions.test.js   # Auction CRUD tests
└── bids.test.js       # Bidding tests
```

### Writing Backend Tests

Example test:
```javascript
const request = require('supertest');
const { app } = require('../server');

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'buyer'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
```

### Test Database

Tests use the same database as development. Consider:
- Using a separate test database
- Cleaning up test data after each run
- Using transactions for isolated tests

---

## 🎨 Frontend Testing

### Setup

```bash
cd frontend
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- AuctionCard.test.jsx

# Watch mode
npm test -- --watch

# With UI
npm test -- --ui

# Coverage
npm test -- --coverage
```

### Test Structure

```
frontend/src/test/
├── setup.js           # Test configuration
├── AuctionCard.test.jsx  # Component test
└── Button.test.jsx       # Component test
```

### Writing Component Tests

Example test:
```javascript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from '../components/Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing with Context

```javascript
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};
```

---

## 🧩 Integration Testing

### Testing Real-Time Features

1. **Socket.IO Testing**

```javascript
import io from 'socket.io-client';

describe('Socket.IO Events', () => {
  let socket;

  beforeAll((done) => {
    socket = io('http://localhost:5000');
    socket.on('connect', done);
  });

  afterAll(() => {
    socket.close();
  });

  it('should receive auction_created event', (done) => {
    socket.on('auction_created', (auction) => {
      expect(auction).toHaveProperty('id');
      done();
    });

    // Trigger auction creation
  });
});
```

2. **API Integration Tests**

```javascript
describe('Auction Flow', () => {
  let sellerToken, buyerToken, auctionId;

  it('seller creates auction', async () => {
    // Register seller
    // Create auction
    // Verify auction exists
  });

  it('buyer places bid', async () => {
    // Register buyer
    // Place bid
    // Verify bid recorded
  });

  it('auction closes after timer', async () => {
    // Wait for timer
    // Verify status changed
  });
});
```

---

## 📊 Test Coverage

### Backend Coverage

Run with coverage:
```bash
cd backend
npm test -- --coverage
```

Target coverage:
- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%

### Frontend Coverage

Run with coverage:
```bash
cd frontend
npm test -- --coverage
```

View coverage report:
```bash
open coverage/index.html
```

---

## 🎯 Critical Test Cases

### Must Test

#### Authentication
- ✅ User registration with valid data
- ✅ User registration with duplicate email
- ✅ User login with valid credentials
- ✅ User login with invalid credentials
- ✅ Token validation
- ✅ Protected route access

#### Auctions
- ✅ Create auction as seller
- ✅ Prevent buyer from creating auction
- ✅ Fetch all auctions
- ✅ Fetch auction by ID
- ✅ Search auctions
- ✅ Filter by status

#### Bidding
- ✅ Place valid bid
- ✅ Reject bid lower than current price
- ✅ Prevent seller bidding on own auction
- ✅ Prevent bidding on closed auction
- ✅ Update highest bid

#### Real-time
- ✅ Socket connection
- ✅ auction_created event broadcast
- ✅ new_bid event broadcast
- ✅ timer_tick event every second
- ✅ Auction auto-close on timer end

#### Admin
- ✅ Admin can view all users
- ✅ Admin can block users
- ✅ Admin can delete auctions
- ✅ Non-admin cannot access admin routes

---

## 🐛 Debugging Tests

### Backend Debugging

```bash
# Run with verbose logging
DEBUG=* npm test

# Run single test with logs
npm test -- auth.test.js --verbose
```

### Frontend Debugging

```bash
# Run with browser UI
npm test -- --ui

# Debug specific test
npm test -- Button.test.jsx --reporter=verbose
```

### Common Issues

#### Tests timing out
```javascript
// Increase timeout
it('long running test', async () => {
  // test code
}, 10000); // 10 second timeout
```

#### Database state issues
```javascript
// Clean up after each test
afterEach(async () => {
  await cleanupDatabase();
});
```

#### Mock Socket.IO
```javascript
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    close: vi.fn()
  }))
}));
```

---

## 🚀 Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8
        env:
          MYSQL_ROOT_PASSWORD: test
          MYSQL_DATABASE: auctra_test
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: cd backend && npm test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm test
```

---

## 📝 Best Practices

1. **Write tests first** (TDD) for new features
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Keep tests isolated and independent**
5. **Mock external dependencies**
6. **Test edge cases and error conditions**
7. **Maintain high coverage**
8. **Run tests before committing**

---

## 🔍 Manual Testing Checklist

### User Flows

- [ ] Register new buyer account
- [ ] Register new seller account
- [ ] Login and logout
- [ ] Create auction with image
- [ ] Create auction without image
- [ ] Browse auctions
- [ ] Search auctions
- [ ] Filter auctions by status
- [ ] View auction details
- [ ] Place bid on active auction
- [ ] Try to bid on own auction (should fail)
- [ ] Monitor real-time bid updates
- [ ] Wait for auction to end
- [ ] Rate seller
- [ ] View seller profile and ratings
- [ ] Admin: Block user
- [ ] Admin: Delete auction
- [ ] Test on mobile device
- [ ] Test on different browsers

---

**Happy Testing! 🧪**
