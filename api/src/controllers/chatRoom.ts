import express, { Request, Response } from 'express';
import { connectToMongoDB } from '../mongoDB/mongoDBConnection'
import ChatRoom from '../models/ChatRoom';
const router = express.Router();

// Route to get list of chatRooms
router.get('/chatRooms', async (req: Request, res: Response) => {
  const db = await connectToMongoDB();
  const collection = db.collection('realtimeChat');
  const chatRooms = await collection.find({ type: 'chatRoom' }).toArray();
  res.json(chatRooms?.map((chatRoomObj) => {
    const { _id, type, ...newChatRoomObject } = chatRoomObj;
    return newChatRoomObject;
  }));
});

// Route to add a new chatRoom
router.post('/chatRooms', async (req: Request, res: Response) => {
  try {
    const chatRoom = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('realtimeChat');
    const count = await collection.countDocuments({ type: 'chatRoom' });
    const existingChatRoom = await collection.findOne({ type: 'chatRoom', roomName: chatRoom.roomName });
    if (existingChatRoom && existingChatRoom.roomName === chatRoom.roomName) {
      res.status(409).json({ error: 'Error while creating chatRoom, duplicate roomName.' });
    } else {
      await collection.insertOne({ ...chatRoom, roomId: count + 1, type: 'chatRoom' });
      const chatRooms = await collection.find({ type: 'chatRoom' }).toArray();
      res.json(chatRooms?.map((chatRoomObj) => {
        const { _id, type, ...newChatRoomObject } = chatRoomObj;
        return newChatRoomObject;
      }));
    }
  } catch (error) {
    res.status(500).json({ error: 'Error while inserting the user.' });
  }
});

// Route to update a chatRoom
router.put('/chatRooms', async (req: Request, res: Response) => {
  try {
    const chatRoomReq: ChatRoom = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('realtimeChat');
   // const count = await collection.countDocuments({ type: 'chatRoom' });

    const chatRoom = await collection.findOne({type:'chatRoom', roomId: chatRoomReq.roomId })
    if(chatRoom){
      await collection.updateOne({ _id: chatRoom?._id }, { $set: {users:chatRoomReq.users, lastUpdatedTimeStamp: chatRoomReq.lastUpdatedTimeStamp}});
      const chatRooms = await collection.find({ type: 'chatRoom' }).toArray();
      res.json(chatRooms?.map((chatRoomObj) => {
        const { _id, type, ...newChatRoomObj } = chatRoomObj;
        return newChatRoomObj;
      }));
    } else {
      res.status(404).json({ error: 'Chat room not found.' });
    }
    
  } catch (error) {
    res.status(500).json({ error: 'Error while inserting the user.' });
  }
});

export default router;
