const express = require('express');
const PnLData = require('../models/PnLData');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await PnLData.findById('latest');
    if (!data) return res.json({ status: 'waiting', message: 'No P&L data ingested yet' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
