const mongoose = require('mongoose');

const pnlRowSchema = new mongoose.Schema({
  sapCode: { type: String, default: '' },
  serialNo: { type: String, default: '' },
  plantName: { type: String, default: '' },
  isSectorTotal: { type: Boolean, default: false },
  salesQtyPlan24: { type: Number, default: 0 },
  salesQtyActual24: { type: Number, default: 0 },
  revenuePlan24: { type: Number, default: 0 },
  revenueActual24: { type: Number, default: 0 },
  gpPlan24: { type: Number, default: 0 },
  gpActual24: { type: Number, default: 0 },
  npPlan24: { type: Number, default: 0 },
  npActual24: { type: Number, default: 0 },
  gpPctPlan24: { type: Number, default: 0 },
  gpPctActual24: { type: Number, default: 0 },
  npPctPlan24: { type: Number, default: 0 },
  npPctActual24: { type: Number, default: 0 },
  salesQtyPlan31: { type: Number, default: 0 },
  salesQtyActual31: { type: Number, default: 0 },
  revenuePlan31: { type: Number, default: 0 },
  revenueActual31: { type: Number, default: 0 },
  gpPlan31: { type: Number, default: 0 },
  gpActual31: { type: Number, default: 0 },
  npPlan31: { type: Number, default: 0 },
  npActual31: { type: Number, default: 0 },
  gpPctPlan31: { type: Number, default: 0 },
  gpPctActual31: { type: Number, default: 0 },
  npPctPlan31: { type: Number, default: 0 },
  npPctActual31: { type: Number, default: 0 },
  productionQtyPlan: { type: Number, default: 0 },
  productionQtyActual: { type: Number, default: 0 },
}, { _id: false });

const pnlDataSchema = new mongoose.Schema({
  _id: { type: String, default: 'latest' },
  reportTitle: { type: String, default: '' },
  rows: { type: [pnlRowSchema], default: [] },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PnLData', pnlDataSchema);
