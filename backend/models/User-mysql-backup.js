const { query } = require('../database');
const bcrypt = require('bcrypt');

class User {
  // Create new user
  static async create({ username, email, password, role = 'buyer' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    const result = await query(sql, [username, email, hashedPassword, role]);
    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const results = await query(sql, [email]);
    return results[0];
  }

  // Find user by ID
  static async findById(id) {
    const sql = 'SELECT id, username, email, role, is_blocked, created_at FROM users WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0];
  }

  // Find user by username
  static async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const results = await query(sql, [username]);
    return results[0];
  }

  // Get all users (admin)
  static async findAll() {
    const sql = 'SELECT id, username, email, role, is_blocked, created_at FROM users ORDER BY created_at DESC';
    return await query(sql);
  }

  // Block/Unblock user
  static async updateBlockStatus(id, isBlocked) {
    const sql = 'UPDATE users SET is_blocked = ? WHERE id = ?';
    await query(sql, [isBlocked, id]);
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get seller rating
  static async getSellerRating(sellerId) {
    const sql = `
      SELECT 
        COUNT(*) as total_ratings,
        AVG(rating) as average_rating
      FROM ratings
      WHERE seller_id = ?
    `;
    const results = await query(sql, [sellerId]);
    return results[0];
  }
}

module.exports = User;
