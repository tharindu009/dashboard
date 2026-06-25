const express = require('express');
const store = require('../store');

const router = express.Router();

router.get('/', (req, res) => {
  if (!store.pnl) return res.json({ status: 'waiting', message: 'No P&L data ingested yet' });
  res.json(store.pnl);
});

module.exports = router;
