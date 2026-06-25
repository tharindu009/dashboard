const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  agg1: { type: Number, default: 0 },
  agg2: { type: Number, default: 0 },
  agg3: { type: Number, default: 0 },
  agg4: { type: Number, default: 0 },
  agg5: { type: Number, default: 0 },
  bitumen: { type: Number, default: 0 },
  filler1: { type: Number, default: 0 },
  filler2: { type: Number, default: 0 },
  additive1: { type: Number, default: 0 },
  additive2: { type: Number, default: 0 },
  totalWeight: { type: Number, default: 0 },
  aggTemp: { type: Number, default: 0 },
  bitumenTemp: { type: Number, default: 0 },
  finishedTemp: { type: Number, default: 0 },
  formulaName: { type: String, default: '' },
}, { _id: false });

const plantRecordSchema = new mongoose.Schema({
  _id: { type: String, default: 'latest' },
  lastBatchTimestamp: { type: String, default: '' },
  batchCount: { type: Number, default: 0 },
  todaysBatchCount: { type: Number, default: 0 },
  todaysTotalWeight: { type: Number, default: 0 },
  totalWeightAllTime: { type: Number, default: 0 },
  latestBatch: { type: batchSchema, default: () => ({}) },
  recentBatches: { type: [batchSchema], default: [] },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PlantRecord', plantRecordSchema);
