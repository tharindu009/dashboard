const express = require('express');
const SparePartsData = require('../models/SparePartsData');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await SparePartsData.findById('latest');
    if (!data) return res.json({ status: 'waiting', message: 'No spare parts data ingested yet' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/alerts', async (req, res) => {
  try {
    const data = await SparePartsData.findById('latest');
    if (!data) return res.json([]);
    const alerts = data.parts.filter(p => p.closingStock === 0).slice(0, 50);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
