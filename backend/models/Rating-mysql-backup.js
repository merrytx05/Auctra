const { query } = require('../database');

class Rating {
  // Create new rating
  static async create({ sellerId, buyerId, auctionId, rating, comment }) {
    const sql = `
      INSERT INTO ratings (seller_id, buyer_id, auction_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)
    `;
    const result = await query(sql, [sellerId, buyerId, auctionId, rating, comment]);
    return result.insertId;
  }

  // Get ratings for seller
  static async findBySeller(sellerId) {
    const sql = `
      SELECT 
        r.*,
        u.username as buyer_username,
        a.title as auction_title
      FROM ratings r
      LEFT JOIN users u ON r.buyer_id = u.id
      LEFT JOIN auctions a ON r.auction_id = a.id
      WHERE r.seller_id = ?
      ORDER BY r.created_at DESC
    `;
    return await query(sql, [sellerId]);
  }

  // Get average rating for seller
  static async getAverageRating(sellerId) {
    const sql = `
      SELECT 
        COUNT(*) as total_ratings,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM ratings
      WHERE seller_id = ?
    `;
    const results = await query(sql, [sellerId]);
    return results[0];
  }

  // Check if buyer can rate seller
  static async canRate(buyerId, auctionId) {
    // Check if auction is closed and buyer has bid on it
    const sql = `
      SELECT COUNT(*) as count
      FROM bids b
      LEFT JOIN auctions a ON b.auction_id = a.id
      WHERE b.buyer_id = ? AND b.auction_id = ? AND a.status = 'closed'
    `;
    const results = await query(sql, [buyerId, auctionId]);
    return results[0].count > 0;
  }

  // Check if rating exists
  static async exists(buyerId, auctionId) {
    const sql = 'SELECT COUNT(*) as count FROM ratings WHERE buyer_id = ? AND auction_id = ?';
    const results = await query(sql, [buyerId, auctionId]);
    return results[0].count > 0;
  }
}

module.exports = Rating;
