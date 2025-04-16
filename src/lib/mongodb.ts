import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!process.env.MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongoCache {
  conn: any;
  promise: Promise<any> | null;
}

// Define the global in TypeScript
declare global {
  var mongo: MongoCache | undefined;
}

let cached: MongoCache = global.mongo || { conn: null, promise: null };

if (!global.mongo) {
  global.mongo = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: MongoClientOptions = {};

    cached.promise = MongoClient.connect(process.env.MONGODB_URI!, opts).then((client) => {
      return {
        client,
        db: client.db(process.env.MONGODB_DB),
      };
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
} 