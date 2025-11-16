const { query } = require('../database');

class Bid {
  // Create new bid
  static async create({ auctionId, buyerId, amount }) {
    const sql = `
      INSERT INTO bids (auction_id, buyer_id, amount)
      VALUES (?, ?, ?)
    `;
    const result = await query(sql, [auctionId, buyerId, amount]);
    return result.insertId;
  }

  // Get bids by auction
  static async findByAuction(auctionId) {
    const sql = `
      SELECT 
        b.*,
        u.username as buyer_username
      FROM bids b
      LEFT JOIN users u ON b.buyer_id = u.id
      WHERE b.auction_id = ?
      ORDER BY b.amount DESC, b.created_at DESC
    `;
    return await query(sql, [auctionId]);
  }

  // Get bids by buyer
  static async findByBuyer(buyerId) {
    const sql = `
      SELECT 
        b.*,
        a.title as auction_title,
        a.status as auction_status,
        a.end_time as auction_end_time,
        a.image_url as auction_image,
        (SELECT MAX(amount) FROM bids WHERE auction_id = b.auction_id) as highest_bid
      FROM bids b
      LEFT JOIN auctions a ON b.auction_id = a.id
      WHERE b.buyer_id = ?
      ORDER BY b.created_at DESC
    `;
    return await query(sql, [buyerId]);
  }

  // Get highest bid for auction
  static async getHighestBid(auctionId) {
    const sql = `
      SELECT 
        b.*,
        u.username as buyer_username
      FROM bids b
      LEFT JOIN users u ON b.buyer_id = u.id
      WHERE b.auction_id = ?
      ORDER BY b.amount DESC
      LIMIT 1
    `;
    const results = await query(sql, [auctionId]);
    return results[0];
  }

  // Check if user has bid on auction
  static async hasBid(auctionId, buyerId) {
    const sql = 'SELECT COUNT(*) as count FROM bids WHERE auction_id = ? AND buyer_id = ?';
    const results = await query(sql, [auctionId, buyerId]);
    return results[0].count > 0;
  }

  // Get bid count for auction
  static async getBidCount(auctionId) {
    const sql = 'SELECT COUNT(*) as count FROM bids WHERE auction_id = ?';
    const results = await query(sql, [auctionId]);
    return results[0].count;
  }
}

module.exports = Bid;
