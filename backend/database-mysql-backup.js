const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'auctra_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database schema
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');

    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('buyer', 'seller', 'admin') DEFAULT 'buyer',
        is_blocked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create Auctions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS auctions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        seller_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        starting_price DECIMAL(10, 2) NOT NULL,
        current_price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255),
        duration INT NOT NULL,
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP NOT NULL,
        status ENUM('active', 'closed') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_status (status),
        INDEX idx_seller (seller_id),
        INDEX idx_end_time (end_time)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create Bids table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bids (
        id INT AUTO_INCREMENT PRIMARY KEY,
        auction_id INT NOT NULL,
        buyer_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
        FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_auction (auction_id),
        INDEX idx_buyer (buyer_id),
        INDEX idx_amount (amount)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create Ratings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        seller_id INT NOT NULL,
        buyer_id INT NOT NULL,
        auction_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
        UNIQUE KEY unique_rating (buyer_id, auction_id),
        INDEX idx_seller (seller_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('✅ Database schema initialized');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Execute raw query
const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

module.exports = {
  pool,
  query,
  initDatabase
};
