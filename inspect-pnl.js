const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, "6.Monitoring P  L May 2026.xlsx");
const wb = XLSX.readFile(filePath);

console.log("=== SHEETS ===");
console.log(wb.SheetNames);

wb.SheetNames.forEach((name, idx) => {
  const sheet = wb.Sheets[name];
  const ref = sheet['!ref'];
  console.log(`\n=== SHEET ${idx}: "${name}" === Range: ${ref}`);
  
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const rowsToShow = Math.min(json.length, 80);
  for (let i = 0; i < rowsToShow; i++) {
    console.log(`Row ${i}:`, JSON.stringify(json[i]));
  }
  console.log(`\nTotal rows: ${json.length}`);
  
  // Try header-based interpretation
  console.log(`\n--- Header-based ---`);
  const hJson = XLSX.utils.sheet_to_json(sheet, { defval: null });
  const hRows = Math.min(hJson.length, 10);
  for (let i = 0; i < hRows; i++) {
    console.log(`Entry ${i}:`, JSON.stringify(hJson[i]));
  }
});
