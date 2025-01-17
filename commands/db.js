import dotenv from 'dotenv';
dotenv.config();
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
    await client.connect();
    console.log("Connected to MongoDB!");
    return client;
}

async function closeDB() {
  if (client.isConnected()) {
    await client.close();
    console.log("Connection to MongoDB closed.");
  }
}

export default {
  connectDB,
  closeDB,
  client,
};
