"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./controllers/users")); // Import the userRoutes router
const chatRoom_1 = __importDefault(require("./controllers/chatRoom")); // Import the userRoutes router
const Messages_1 = __importDefault(require("./controllers/Messages")); // Import the userRoutes router
const cors_1 = __importDefault(require("cors"));
const mongoDBConnection_1 = require("./mongoDB/mongoDBConnection");
const app = (0, express_1.default)();
const port = process.env.PORT || 9001;
var corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use((0, cors_1.default)(corsOptions));
// Parse JSON request bodies
app.use(express_1.default.json());
// Parse URL-encoded request bodies
app.use(express_1.default.urlencoded({ extended: true }));
// Use the userRoutes router
app.use(users_1.default);
// Use the chatRoomRoutes router
app.use(chatRoom_1.default);
// Use the messagesRoutes router
app.use(Messages_1.default);
// Call the function to connect to MongoDB
(0, mongoDBConnection_1.connectToMongoDB)();
app.get('/', (req, res) => {
    res.send('Hello, Express with TypeScript!!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
