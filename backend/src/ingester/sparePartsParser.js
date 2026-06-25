const XLSX = require('xlsx');

function parseValue(v) {
  if (v === null || v === undefined || v === '') return 0;
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function parseSpareParts(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets['Sheet1'];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  const parts = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 4) continue;
    const desc = String(row[0] || '').trim();
    if (!desc) continue;

    const entry = {
      materialDescription: desc,
      unit: String(row[1] || '').trim(),
      closingStock: parseValue(row[2]),
      closingValue: parseValue(row[3]),
      materialCode: String(row[4] || '').trim(),
      valA: parseValue(row[5]),
      openingStock: parseValue(row[9]),
      totalReceiptQty: parseValue(row[10]),
      totalIssueQty: parseValue(row[11]),
      openingValue: parseValue(row[12]),
      totalReceiptValue: parseValue(row[13]),
      totalIssueValue: parseValue(row[14]),
    };
    parts.push(entry);
  }

  const totalStockValue = parts.reduce((s, p) => s + p.closingValue, 0);
  const zeroStockItems = parts.filter(p => p.closingStock === 0).length;

  return {
    lastUpdated: new Date(),
    totalItems: parts.length,
    totalStockValue,
    zeroStockItems,
    parts,
  };
}

module.exports = { parseSpareParts };
