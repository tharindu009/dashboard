const path = require('path');
const store = require('../store');
const { parsePnL } = require('./pnlParser');

let lastHash = '';
let timer = null;

function hashFile(filePath) {
  try {
    const fs = require('fs');
    const stat = fs.statSync(filePath);
    return `${stat.size}-${stat.mtimeMs}`;
  } catch {
    return '';
  }
}

async function pollPnLOnce(filePath) {
  const currentHash = hashFile(filePath);
  if (!currentHash) return false;
  if (currentHash === lastHash) return false;

  try {
    const data = parsePnL(filePath);
    if (!data || data.rows.length === 0) return false;

    store.pnl = { ...data, lastUpdated: new Date() };
    lastHash = currentHash;
    console.log(`[PnL] Updated: ${data.rows.length} rows, report: ${data.reportTitle}`);
    return data;
  } catch (err) {
    console.error(`[PnL] Error: ${err.message}`);
    return false;
  }
}

function startPnLPolling(filePath, intervalMs) {
  if (!filePath) {
    console.log('[PnL] No file path configured, skipping');
    return;
  }
  const resolvedPath = path.resolve(__dirname, '..', '..', filePath);
  console.log(`[PnL] Watching: ${resolvedPath} every ${intervalMs}ms`);

  timer = setInterval(async () => {
    await pollPnLOnce(resolvedPath);
  }, intervalMs);

  pollPnLOnce(resolvedPath);
}

module.exports = { startPnLPolling, pollPnLOnce };
