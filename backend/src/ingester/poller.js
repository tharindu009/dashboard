const fs = require('fs');
const path = require('path');
const store = require('../store');
const { parsePlantRecord } = require('./parser');

let lastHash = '';
let pollTimer = null;

function hashFile(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return `${stat.size}-${stat.mtimeMs}`;
  } catch {
    return '';
  }
}

async function pollOnce(filePath) {
  const currentHash = hashFile(filePath);
  if (!currentHash) {
    console.log('[Poller] File not accessible (locked or missing)');
    return false;
  }
  if (currentHash === lastHash) return false;

  try {
    const data = parsePlantRecord(filePath);
    if (!data) {
      console.log('[Poller] No data parsed from file');
      return false;
    }

    store.plant = { ...data, lastUpdated: new Date() };
    lastHash = currentHash;
    console.log(`[Poller] Updated: ${data.batchCount} batches, latest: ${data.lastBatchTimestamp}`);
    return data;
  } catch (err) {
    console.error(`[Poller] Error parsing file: ${err.message}`);
    return false;
  }
}

function startPolling(filePath, intervalMs) {
  if (!filePath) {
    console.log('[Poller] No file path configured, skipping');
    return;
  }
  const resolvedPath = path.resolve(__dirname, '..', '..', filePath);
  console.log(`[Poller] Watching: ${resolvedPath} every ${intervalMs}ms`);

  pollTimer = setInterval(async () => {
    await pollOnce(resolvedPath);
  }, intervalMs);

  pollOnce(resolvedPath);
}

function stopPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = null;
}

module.exports = { startPolling, stopPolling, pollOnce };
