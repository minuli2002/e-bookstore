const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || './database/bookstore.db';
const dbDir = path.dirname(dbPath);

// Create database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
console.log('Connected to SQLite database');

const initializeDatabase = () => {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Users table ready');

  // Create books table
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image_url TEXT,
      category TEXT DEFAULT 'general',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Books table ready');

  // Insert sample books if table is empty
  const count = db.prepare('SELECT COUNT(*) as count FROM books').get();
  if (count.count === 0) {
    const insertBook = db.prepare('INSERT INTO books (title, author, price, image_url, category) VALUES (?, ?, ?, ?, ?)');
    
    // New Arrivals (3 books)
    insertBook.run('Cammelia', 'Author Name', 20.00, 'images/arr1.jpg', 'new');
    insertBook.run('Cammelia', 'Author Name', 25.00, 'images/arr2.webp', 'new');
    insertBook.run('Cammelia', 'Author Name', 23.00, 'images/arr3.jpg', 'new');
    
    // Featured (6 books)
    insertBook.run('Secret Garden', 'Author Name', 25.00, 'images/fbook1.webp', 'featured');
    insertBook.run('Anne of Green Gables', 'Author Name', 30.00, 'images/fbook2.jpg', 'featured');
    insertBook.run('Cottage by the sea', 'Author Name', 28.00, 'images/fbook3.jpg', 'featured');
    insertBook.run('Witch Garden', 'Author Name', 32.00, 'images/fbook4.jpg', 'featured');
    insertBook.run('The Gardener', 'Author Name', 27.00, 'images/fbook5.jpg', 'featured');
    insertBook.run('Cleaner of Chartres', 'Author Name', 29.00, 'images/fbook6.jpg', 'featured');
    
    console.log('Sample books inserted');
  }
};

module.exports = { db, initializeDatabase };