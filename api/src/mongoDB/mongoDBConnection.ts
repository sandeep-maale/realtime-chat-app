import { MongoClient, Db } from 'mongodb';

// MongoDB connection URI (replace with your own)
const uri = 'mongodb://localhost:27017/chatbot';
let client: MongoClient | null = null;

export async function connectToMongoDB(): Promise<Db> {
  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      console.log('Connected to MongoDB');
    }
    return client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
