const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function connectDB() {
  const useMemoryDb = process.env.USE_MEMORY_DB === 'true';
  let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dashboard';

  if (useMemoryDb) {
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    console.log(`[DB] Using in-memory MongoDB at ${uri}`);
  } else {
    console.log(`[DB] Connecting to MongoDB at ${uri}`);
  }

  await mongoose.connect(uri);
  console.log('[DB] Connected to MongoDB');
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}

module.exports = { connectDB, disconnectDB };
