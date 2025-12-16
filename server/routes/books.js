const express = require('express');
const { db } = require('../config/database');

const router = express.Router();

// Get new arrival books
router.get('/new-arrivals', (req, res) => {
  try {
    const books = db.prepare('SELECT * FROM books WHERE category = ? LIMIT 3').all('new');
    res.json(books);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get featured books
router.get('/featured', (req, res) => {
  try {
    const books = db.prepare('SELECT * FROM books WHERE category = ? LIMIT 6').all('featured');
    res.json(books);
  } catch (error) {
    console.error('Error fetching featured books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Search books
router.get('/search', (req, res) => {
  try {
    const searchQuery = req.query.q || '';
    if (!searchQuery) {
      return res.json([]);
    }
    
    const books = db.prepare(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?'
    ).all(`%${searchQuery}%`, `%${searchQuery}%`);
    
    res.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Failed to search books' });
  }
});

module.exports = router;