import express, { Request, Response,  } from 'express';
import userRoutes from './controllers/users'; // Import the userRoutes router
import chatRoomRoutes from './controllers/chatRoom'; // Import the userRoutes router
import messagesRoutes from './controllers/Messages'; // Import the userRoutes router
import cors from 'cors';
import { connectToMongoDB } from './mongoDB/mongoDBConnection';

const app = express();
const port = process.env.PORT || 9001;


var corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], // We are allowing localhost:3000 UI app tp call Backend service.
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Use the userRoutes router
app.use(userRoutes);

// Use the chatRoomRoutes router
app.use(chatRoomRoutes);

// Use the messagesRoutes router
app.use(messagesRoutes);

// Call the function to connect to MongoDB
connectToMongoDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
