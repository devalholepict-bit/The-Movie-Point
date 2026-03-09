const mongoose = require('mongoose');

/**
 * Serverless-optimised MongoDB connection.
 * Uses a module-level cached promise so the connection is
 * reused across hot invocations of the same Vercel function
 * instance instead of creating a new connection on each request.
 */
let cached = global._mongooseConnection;

if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,       // don't queue ops if disconnected
      serverSelectionTimeoutMS: 10000,
    };
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongooseInstance) => {
        console.log(`✅ MongoDB Connected: ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;     // reset so next invocation retries
        throw err;                 // do NOT call process.exit — it kills the serverless worker
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
