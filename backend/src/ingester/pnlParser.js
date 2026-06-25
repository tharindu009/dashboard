const XLSX = require('xlsx');

let lastHash = '';
let cachedData = null;

function parseValue(v) {
  if (v === null || v === undefined || v === '') return 0;
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function hasSapCode(row) {
  return row[1] && String(row[1]).trim().length > 0;
}

function parsePnL(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  const reportTitle = rows[2] ? rows[2][8] || '' : '';
  const dataRows = [];

  for (let i = 6; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 8) continue;

    let plantName = String(row[7] || '').trim();
    let serialNo = String(row[6] || '').trim();

    if (!plantName && serialNo) {
      plantName = serialNo;
      serialNo = '';
    }
    if (!plantName) continue;

    const sapCode = String(row[1] || '').trim();

    const isSector = Boolean(
      !sapCode && row[6] && String(row[6]).trim().length > 0 &&
      (plantName.includes('Sector') || plantName.includes('Total') ||
       plantName.includes('Without CWCT'))
    );

    const entry = {
      sapCode,
      serialNo,
      plantName,
      isSectorTotal: Boolean(isSector),
      salesQtyPlan24: parseValue(row[8]),
      salesQtyActual24: parseValue(row[9]),
      revenuePlan24: parseValue(row[10]),
      revenueActual24: parseValue(row[11]),
      gpPlan24: parseValue(row[12]),
      gpActual24: parseValue(row[13]),
      npPlan24: parseValue(row[14]),
      npActual24: parseValue(row[15]),
      gpPctPlan24: parseValue(row[16]),
      gpPctActual24: parseValue(row[17]),
      npPctPlan24: parseValue(row[18]),
      npPctActual24: parseValue(row[19]),
      salesQtyPlan31: parseValue(row[20]),
      salesQtyActual31: parseValue(row[21]),
      revenuePlan31: parseValue(row[22]),
      revenueActual31: parseValue(row[23]),
      gpPlan31: parseValue(row[24]),
      gpActual31: parseValue(row[25]),
      npPlan31: parseValue(row[26]),
      npActual31: parseValue(row[27]),
      gpPctPlan31: parseValue(row[28]),
      gpPctActual31: parseValue(row[29]),
      npPctPlan31: parseValue(row[30]),
      npPctActual31: parseValue(row[31]),
      productionQtyPlan: parseValue(row[32]),
      productionQtyActual: parseValue(row[33]),
    };

    dataRows.push(entry);
  }

  return {
    reportTitle,
    rows: dataRows,
    lastUpdated: new Date(),
  };
}

module.exports = { parsePnL };
