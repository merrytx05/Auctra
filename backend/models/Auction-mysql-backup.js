const { query } = require('../database');

class Auction {
  // Create new auction
  static async create({ sellerId, title, description, startingPrice, duration, imageUrl }) {
    const endTime = new Date(Date.now() + duration * 1000);
    const sql = `
      INSERT INTO auctions (seller_id, title, description, starting_price, current_price, duration, end_time, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      sellerId,
      title,
      description,
      startingPrice,
      startingPrice,
      duration,
      endTime,
      imageUrl
    ]);
    return result.insertId;
  }

  // Find auction by ID
  static async findById(id) {
    const sql = `
      SELECT 
        a.*,
        u.username as seller_username,
        u.email as seller_email,
        (SELECT COUNT(*) FROM bids WHERE auction_id = a.id) as bid_count,
        (SELECT MAX(amount) FROM bids WHERE auction_id = a.id) as highest_bid
      FROM auctions a
      LEFT JOIN users u ON a.seller_id = u.id
      WHERE a.id = ?
    `;
    const results = await query(sql, [id]);
    return results[0];
  }

  // Get all auctions with filters
  static async findAll({ search, status, limit = 20, offset = 0 }) {
    let sql = `
      SELECT 
        a.*,
        u.username as seller_username,
        (SELECT COUNT(*) FROM bids WHERE auction_id = a.id) as bid_count,
        (SELECT MAX(amount) FROM bids WHERE auction_id = a.id) as highest_bid
      FROM auctions a
      LEFT JOIN users u ON a.seller_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ' AND (a.title LIKE ? OR a.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return await query(sql, params);
  }

  // Get auctions by seller
  static async findBySeller(sellerId) {
    const sql = `
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM bids WHERE auction_id = a.id) as bid_count,
        (SELECT MAX(amount) FROM bids WHERE auction_id = a.id) as highest_bid
      FROM auctions a
      WHERE a.seller_id = ?
      ORDER BY a.created_at DESC
    `;
    return await query(sql, [sellerId]);
  }

  // Get active auctions
  static async findActive() {
    const sql = `
      SELECT 
        a.*,
        u.username as seller_username,
        (SELECT COUNT(*) FROM bids WHERE auction_id = a.id) as bid_count,
        (SELECT MAX(amount) FROM bids WHERE auction_id = a.id) as highest_bid
      FROM auctions a
      LEFT JOIN users u ON a.seller_id = u.id
      WHERE a.status = 'active' AND a.end_time > NOW()
      ORDER BY a.created_at DESC
    `;
    return await query(sql);
  }

  // Update auction status
  static async updateStatus(id, status) {
    const sql = 'UPDATE auctions SET status = ? WHERE id = ?';
    await query(sql, [status, id]);
  }

  // Update current price
  static async updateCurrentPrice(id, price) {
    const sql = 'UPDATE auctions SET current_price = ? WHERE id = ?';
    await query(sql, [price, id]);
  }

  // Delete auction
  static async delete(id) {
    const sql = 'DELETE FROM auctions WHERE id = ?';
    await query(sql, [id]);
  }

  // Get time remaining for auction
  static async getTimeRemaining(id) {
    const sql = 'SELECT TIMESTAMPDIFF(SECOND, NOW(), end_time) as seconds_left FROM auctions WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0]?.seconds_left || 0;
  }
}

module.exports = Auction;
