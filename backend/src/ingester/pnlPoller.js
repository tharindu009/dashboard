const path = require('path');
const PnLData = require('../models/PnLData');
const { parsePnL } = require('./pnlParser');

let lastHash = '';

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

    await PnLData.findOneAndReplace(
      { _id: 'latest' },
      { _id: 'latest', ...data },
      { upsert: true, returnDocument: 'after' }
    );

    lastHash = currentHash;
    console.log(`[PnL] Updated: ${data.rows.length} rows, report: ${data.reportTitle}`);
    return data;
  } catch (err) {
    console.error(`[PnL] Error: ${err.message}`);
    return false;
  }
}

function startPnLPolling(filePath, intervalMs, onUpdate) {
  const resolvedPath = path.resolve(__dirname, '..', '..', filePath);
  console.log(`[PnL] Watching: ${resolvedPath} every ${intervalMs}ms`);

  const timer = setInterval(async () => {
    const data = await pollPnLOnce(resolvedPath);
    if (data && onUpdate) onUpdate(data);
  }, intervalMs);

  pollPnLOnce(resolvedPath).then(data => {
    if (data && onUpdate) onUpdate(data);
  });

  return timer;
}

module.exports = { startPnLPolling, pollPnLOnce };
