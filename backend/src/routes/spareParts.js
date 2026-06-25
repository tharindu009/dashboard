const express = require('express');
const store = require('../store');

const router = express.Router();

router.get('/', (req, res) => {
  if (!store.spare) return res.json({ status: 'waiting', message: 'No spare parts data ingested yet' });
  res.json(store.spare);
});

router.get('/alerts', (req, res) => {
  if (!store.spare) return res.json([]);
  const alerts = store.spare.parts.filter(p => p.closingStock === 0).slice(0, 50);
  res.json(alerts);
});

module.exports = router;
