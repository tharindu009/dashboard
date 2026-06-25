const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const PlantRecord = require('../models/PlantRecord');
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

    await PlantRecord.findOneAndReplace(
      { _id: 'latest' },
      { _id: 'latest', ...data },
      { upsert: true, returnDocument: 'after' }
    );

    lastHash = currentHash;
    console.log(`[Poller] Updated: ${data.batchCount} batches, latest: ${data.lastBatchTimestamp}`);
    return data;
  } catch (err) {
    console.error(`[Poller] Error parsing file: ${err.message}`);
    return false;
  }
}

function startPolling(filePath, intervalMs, onUpdate) {
  const resolvedPath = path.resolve(__dirname, '..', '..', filePath);
  console.log(`[Poller] Watching: ${resolvedPath} every ${intervalMs}ms`);

  pollTimer = setInterval(async () => {
    const data = await pollOnce(resolvedPath);
    if (data && onUpdate) onUpdate(data);
  }, intervalMs);

  pollOnce(resolvedPath).then(data => {
    if (data && onUpdate) onUpdate(data);
  });
}

function stopPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = null;
}

module.exports = { startPolling, stopPolling, pollOnce };
