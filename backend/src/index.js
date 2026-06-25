require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const { startPolling } = require('./ingester/poller');
const { startPnLPolling } = require('./ingester/pnlPoller');
const { startSparePolling } = require('./ingester/sparePartsPoller');
const plantRoutes = require('./routes/plant');
const pnlRoutes = require('./routes/pnl');
const spareRoutes = require('./routes/spareParts');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/plant', plantRoutes);
app.use('/api/pnl', pnlRoutes);
app.use('/api/spare-parts', spareRoutes);

const distPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

async function main() {
  await connectDB();

  startPolling(
    process.env.EXCEL_PATH,
    parseInt(process.env.POLL_INTERVAL_MS || '3000')
  );

  startPnLPolling(
    process.env.PNL_EXCEL_PATH,
    parseInt(process.env.POLL_INTERVAL_MS_PNL || '5000')
  );

  startSparePolling(
    process.env.SPARE_EXCEL_PATH,
    parseInt(process.env.POLL_INTERVAL_MS_SPARE || '5000')
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  });
}

main().catch(console.error);
