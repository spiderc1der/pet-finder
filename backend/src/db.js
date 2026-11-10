/**
 * database connection 
 */

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  await client.connect();

  console.log('Connected to MongoDB Atlas!');

  const db = client.db('csPets');

  return db;
}

module.exports = { connectToDatabase };
