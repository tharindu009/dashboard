const XLSX = require('xlsx');

const COLUMNS = {
  timestamp: 0,
  agg1: 1,
  agg2: 2,
  agg3: 3,
  agg4: 4,
  agg5: 5,
  bitumen: 6,
  filler1: 7,
  filler2: 8,
  additive1: 9,
  additive2: 10,
  totalWeight: 11,
  aggTemp: 12,
  bitumenTemp: 13,
  finishedTemp: 14,
  formulaName: 15,
};

function parseValue(v) {
  if (v === null || v === undefined || v === '') return 0;
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function parsePlantRecord(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets['Sheet1'];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const batches = [];
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;
    const ts = String(row[0]).trim();
    if (ts === 'Total(ton)') continue;

    const batch = {
      timestamp: ts,
      agg1: parseValue(row[COLUMNS.agg1]),
      agg2: parseValue(row[COLUMNS.agg2]),
      agg3: parseValue(row[COLUMNS.agg3]),
      agg4: parseValue(row[COLUMNS.agg4]),
      agg5: parseValue(row[COLUMNS.agg5]),
      bitumen: parseValue(row[COLUMNS.bitumen]),
      filler1: parseValue(row[COLUMNS.filler1]),
      filler2: parseValue(row[COLUMNS.filler2]),
      additive1: parseValue(row[COLUMNS.additive1]),
      additive2: parseValue(row[COLUMNS.additive2]),
      totalWeight: parseValue(row[COLUMNS.totalWeight]),
      aggTemp: parseValue(row[COLUMNS.aggTemp]),
      bitumenTemp: parseValue(row[COLUMNS.bitumenTemp]),
      finishedTemp: parseValue(row[COLUMNS.finishedTemp]),
      formulaName: row[COLUMNS.formulaName] || '',
    };
    batches.push(batch);
  }

  if (batches.length === 0) return null;

  const latestBatch = batches[batches.length - 1];
  const todaysBatches = batches.filter(b => b.timestamp.startsWith(todayStr));
  const todaysTotalWeight = todaysBatches.reduce((sum, b) => sum + b.totalWeight, 0);
  const totalWeightAllTime = batches.reduce((sum, b) => sum + b.totalWeight, 0);

  return {
    lastBatchTimestamp: latestBatch.timestamp,
    batchCount: batches.length,
    todaysBatchCount: todaysBatches.length,
    todaysTotalWeight,
    totalWeightAllTime,
    latestBatch,
    recentBatches: batches.slice(-100),
    lastUpdated: new Date(),
  };
}

module.exports = { parsePlantRecord };
