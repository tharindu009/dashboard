const path = require('path');
const store = require('../store');
const { parseSpareParts } = require('./sparePartsParser');

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

async function pollSpareOnce(filePath) {
  const currentHash = hashFile(filePath);
  if (!currentHash) return false;
  if (currentHash === lastHash) return false;

  try {
    const data = parseSpareParts(filePath);
    if (!data || data.parts.length === 0) return false;

    store.spare = { ...data, lastUpdated: new Date() };
    lastHash = currentHash;
    console.log(`[Spare] Updated: ${data.totalItems} parts, value: ${data.totalStockValue.toFixed(0)}`);
    return data;
  } catch (err) {
    console.error(`[Spare] Error: ${err.message}`);
    return false;
  }
}

function startSparePolling(filePath, intervalMs) {
  if (!filePath) {
    console.log('[Spare] No file path configured, skipping');
    return;
  }
  const resolvedPath = path.resolve(__dirname, '..', '..', filePath);
  console.log(`[Spare] Watching: ${resolvedPath} every ${intervalMs}ms`);

  timer = setInterval(async () => {
    await pollSpareOnce(resolvedPath);
  }, intervalMs);

  pollSpareOnce(resolvedPath);
}

module.exports = { startSparePolling, pollSpareOnce };
