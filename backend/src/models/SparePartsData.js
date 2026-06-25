const mongoose = require('mongoose');

const sparePartSchema = new mongoose.Schema({
  materialDescription: { type: String, default: '' },
  unit: { type: String, default: '' },
  closingStock: { type: Number, default: 0 },
  closingValue: { type: Number, default: 0 },
  materialCode: { type: String, default: '' },
  valA: { type: Number, default: 0 },
  openingStock: { type: Number, default: 0 },
  totalReceiptQty: { type: Number, default: 0 },
  totalIssueQty: { type: Number, default: 0 },
  openingValue: { type: Number, default: 0 },
  totalReceiptValue: { type: Number, default: 0 },
  totalIssueValue: { type: Number, default: 0 },
}, { _id: false });

const sparePartsDataSchema = new mongoose.Schema({
  _id: { type: String, default: 'latest' },
  lastUpdated: { type: Date, default: Date.now },
  totalItems: { type: Number, default: 0 },
  totalStockValue: { type: Number, default: 0 },
  zeroStockItems: { type: Number, default: 0 },
  parts: { type: [sparePartSchema], default: [] },
});

module.exports = mongoose.model('SparePartsData', sparePartsDataSchema);
