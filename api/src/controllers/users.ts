import express, { Request, Response } from 'express';
import User, { Status } from '../models/User';
import { connectToMongoDB } from '../mongoDB/mongoDBConnection'
const router = express.Router();

// Route to get a user
router.get('/user', async (req: Request, res: Response) => {

  // Access query parameters using req.query
  const email = req.query.email;
  const password = req.query.password;

  const db = await connectToMongoDB();
  const collection = db.collection('realtimeChat');
  const user = await collection.findOne({ type: 'user', email: email });
  if (user) {
    if (user.password === password) {
      const { _id, password, type, ...newUser } = user;
      res.json({ ...newUser });
    }
    else {
      res.status(400).json({ error: 'Entered wrong password, please check.' });
    }
  } else {
    res.status(404).json({ error: 'User not found with the email id.' });
  }
});

// Route to get a list of users
router.get('/users', async (req: Request, res: Response) => {
  const db = await connectToMongoDB();
  const collection = db.collection('realtimeChat');
  const users = await collection.find({ type: 'user' }).toArray();
  res.json(users?.map((userObj) => {
    const { _id, password, type, ...newUserObject } = userObj;
    return newUserObject;
  }));
});

// Route to add a new user
router.post('/users', async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('realtimeChat');
    await collection.insertOne({ ...user, type: 'user' });
    const users = await collection.find({ type: 'user' }).toArray();
    res.json(users?.map((userObj) => {
      const { _id, password, type, ...newUserObject } = userObj;
      return newUserObject;
    }));
  } catch (error) {
    res.status(500).json({ error: 'Error while inserting the user.' });
  }
});

// Route to add a new user
router.put('/users', async (req: Request, res: Response) => {
  try {
    const userReq: User = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('realtimeChat');
    const user = await collection.findOne({ type: 'user', email: userReq.email })
    if (user) {
      await collection.updateOne({ _id: user?._id }, { $set: { status: userReq.status } });
      const users = await collection.find({ type: 'user' }).toArray();
      res.json(users?.map((userObj) => {
        const { _id, password, type, ...newUserObject } = userObj;
        return newUserObject;
      }));
    }
    else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error while inserting the user.' });
  }
});
router.get('/fetchAll', async (req: Request, res: Response) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('realtimeChat');
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error while inserting the user.' });
  }
});

export default router;
