// Address CRUD routes
// All routes are protected by a simple JWT auth middleware

const express = require('express');
const jwt = require('jsonwebtoken');
const Address = require('../models/Address');

const router = express.Router();

// Middleware: verify JWT from Authorization header "Bearer <token>"
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring('Bearer '.length)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const payload = jwt.verify(token, secret);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// GET /api/addresses
// List all addresses for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await Address.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    console.error('Addresses list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/addresses
// Create a new address for the user
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { line1, line2, city, state, zip } = req.body;
    if (!line1 || !city || !state || !zip) {
      return res.status(400).json({ message: 'line1, city, state, zip are required' });
    }
    const item = await Address.create({ userId: req.userId, line1, line2, city, state, zip });
    res.status(201).json({ message: 'Address created', item });
  } catch (err) {
    console.error('Address create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/addresses/:id
// Update an existing address owned by the user
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { line1, line2, city, state, zip } = req.body;
    const updated = await Address.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { line1, line2, city, state, zip },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address updated', item: updated });
  } catch (err) {
    console.error('Address update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/addresses/:id
// Delete an address owned by the user
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Address.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deleted) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address deleted' });
  } catch (err) {
    console.error('Address delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;