const express = require('express');
const Period = require('../models/Period');
const Filter = require('../models/Filter');

const router = express.Router();

/**
 * Get all defined periods
 */
router.get('/periods', async (req, res) => {
  try {
    const periods = await Period.find();
    res.json(periods);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to fetch periods' });
  }
});

/**
 * Add a new period
 */
router.post('/periods', async (req, res) => {
  try {
    const newPeriod = new Period(req.body);
    await newPeriod.save();
    res.status(201).json(newPeriod);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * Get user filters
 */
router.get('/filters/:userId', async (req, res) => {
  try {
    const filters = await Filter.findOne({ userId: req.params.userId });
    res.json(filters || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

/**
 * Update user filters
 */
router.put('/filters/:userId', async (req, res) => {
  try {
    const filters = await Filter.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(filters);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
