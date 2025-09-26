const express = require('express');
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, age, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
