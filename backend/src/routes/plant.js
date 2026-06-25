const express = require('express');
const store = require('../store');

const router = express.Router();

router.get('/', (req, res) => {
  if (!store.plant) return res.json({ status: 'waiting', message: 'No data ingested yet' });
  res.json(store.plant);
});

module.exports = router;
