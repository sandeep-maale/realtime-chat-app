import express, { Request, Response } from 'express';
import { connectToMongoDB } from '../mongoDB/mongoDBConnection'
const router = express.Router();

// Route to get a list of users
router.get('/messages', async (req: Request, res: Response) => {
  // Access query parameters using req.query
  const roomId: string | undefined = req.query.roomId as string;
  const timeStamp: string | undefined = req.query.timeStamp as string;

  const db = await connectToMongoDB();
  const collection = db.collection('realtimeChat');
  let messages: any[] = [];

  if (roomId && !isNaN(parseFloat(roomId)) && timeStamp && !isNaN(parseFloat(timeStamp))) {
    messages = await collection.find({ type: 'message', roomId: parseFloat(roomId), timeStamp: parseFloat(timeStamp) }).toArray();
  } else if (roomId && !isNaN(parseFloat(roomId))) {
    messages = await collection.find({ type: 'message', roomId: parseFloat(roomId) }).toArray();
  } else {
    messages = await collection.find({ type: 'message' }).toArray();
  }

  res.json(messages?.map((messageObj) => {
    const { _id, type, ...newMessageObj } = messageObj;
    return newMessageObj;
  }));
});

// Route to add a new message
router.post('/messages', async (req: Request, res: Response) => {
  try {
    const message = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('realtimeChat');
    await collection.insertOne({ ...message, type: 'message' });
    const messages = await collection.find({ type: 'message', roomId: message.roomId }).toArray();
    res.json(messages?.map((messageObj) => {
      const { _id, type, ...newMessageObj } = messageObj;
      return newMessageObj;
    }));
  } catch (error) {
    res.status(500).json({ error: 'Error while creating the message.' });
  }
});

export default router;
