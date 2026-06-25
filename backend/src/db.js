const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  console.log(`[DB] Connecting to MongoDB Atlas...`);
  await mongoose.connect(uri);
  console.log('[DB] Connected to MongoDB');
}

module.exports = { connectDB };
