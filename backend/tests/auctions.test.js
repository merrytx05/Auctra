const request = require('supertest');
const { app } = require('../server');
const path = require('path');

describe('Auction Endpoints', () => {
  let sellerToken;
  let buyerToken;
  let auctionId;

  beforeAll(async () => {
    // Create seller user
    const sellerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'seller' + Date.now(),
        email: `seller${Date.now()}@example.com`,
        password: 'password123',
        role: 'seller'
      });
    sellerToken = sellerRes.body.token;

    // Create buyer user
    const buyerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'buyer' + Date.now(),
        email: `buyer${Date.now()}@example.com`,
        password: 'password123',
        role: 'buyer'
      });
    buyerToken = buyerRes.body.token;
  });

  describe('POST /api/auctions', () => {
    it('should create auction as seller', async () => {
      const res = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${sellerToken}`)
        .field('title', 'Test Auction')
        .field('description', 'Test auction description')
        .field('startingPrice', '100')
        .field('duration', '3600');

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('auction');
      expect(res.body.auction.title).toBe('Test Auction');
      auctionId = res.body.auction.id;
    });

    it('should not create auction as buyer', async () => {
      const res = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${buyerToken}`)
        .field('title', 'Test Auction')
        .field('startingPrice', '100')
        .field('duration', '3600');

      expect(res.statusCode).toBe(403);
    });

    it('should not create auction without authentication', async () => {
      const res = await request(app)
        .post('/api/auctions')
        .field('title', 'Test Auction')
        .field('startingPrice', '100')
        .field('duration', '3600');

      expect(res.statusCode).toBe(401);
    });

    it('should not create auction with invalid data', async () => {
      const res = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${sellerToken}`)
        .field('title', 'Te')
        .field('startingPrice', '-10')
        .field('duration', '30');

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/auctions', () => {
    it('should get all auctions', async () => {
      const res = await request(app)
        .get('/api/auctions');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('auctions');
      expect(Array.isArray(res.body.auctions)).toBe(true);
    });

    it('should search auctions', async () => {
      const res = await request(app)
        .get('/api/auctions?search=Test');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('auctions');
    });
  });

  describe('GET /api/auctions/:id', () => {
    it('should get auction by id', async () => {
      const res = await request(app)
        .get(`/api/auctions/${auctionId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.auction.id).toBe(auctionId);
    });

    it('should return 404 for non-existent auction', async () => {
      const res = await request(app)
        .get('/api/auctions/999999');

      expect(res.statusCode).toBe(404);
    });
  });
});
