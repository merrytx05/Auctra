const request = require('supertest');
const { app } = require('../server');

describe('Bid Endpoints', () => {
  let sellerToken;
  let buyerToken;
  let auctionId;

  beforeAll(async () => {
    // Create seller and auction
    const sellerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'seller' + Date.now(),
        email: `seller${Date.now()}@example.com`,
        password: 'password123',
        role: 'seller'
      });
    sellerToken = sellerRes.body.token;

    const auctionRes = await request(app)
      .post('/api/auctions')
      .set('Authorization', `Bearer ${sellerToken}`)
      .field('title', 'Bid Test Auction')
      .field('description', 'Test')
      .field('startingPrice', '100')
      .field('duration', '3600');
    auctionId = auctionRes.body.auction.id;

    // Create buyer
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

  describe('POST /api/bids', () => {
    it('should place bid as buyer', async () => {
      const res = await request(app)
        .post('/api/bids')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          auctionId,
          amount: 150
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('bid');
      expect(res.body.bid.amount).toBe(150);
    });

    it('should place higher bid', async () => {
      const res = await request(app)
        .post('/api/bids')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          auctionId,
          amount: 200
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.bid.amount).toBe(200);
    });

    it('should not place lower bid', async () => {
      const res = await request(app)
        .post('/api/bids')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          auctionId,
          amount: 150
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('higher');
    });

    it('should not place bid as seller on own auction', async () => {
      const res = await request(app)
        .post('/api/bids')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          auctionId,
          amount: 250
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/bids/my-bids', () => {
    it('should get buyer bids', async () => {
      const res = await request(app)
        .get('/api/bids/my-bids')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('bids');
      expect(Array.isArray(res.body.bids)).toBe(true);
    });
  });
});
