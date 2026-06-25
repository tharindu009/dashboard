const express = require('express');
const PlantRecord = require('../models/PlantRecord');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await PlantRecord.findById('latest');
    if (!data) return res.json({ status: 'waiting', message: 'No data ingested yet' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
