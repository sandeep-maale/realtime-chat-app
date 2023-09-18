"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("./models/User");
const router = express_1.default.Router();
// Sample user data
const chatRooms = [
    {
        roomName: 'Chat Room Dev', users: [{
                firstName: 'Akshaj', lastName: 'Maale', email: 'akshaj.maale@gmail.com',
                status: User_1.Status.Online
            }, {
                firstName: 'Sandeep', lastName: 'Maale', email: 'sandeep.maale@gmail.com',
                status: User_1.Status.Offline
            }], roomId: 123, createTimeStamp: 1694557660776
    },
    {
        roomName: 'Chat Room Support', users: [{
                firstName: 'Akshaj', lastName: 'Maale', email: 'akshaj.maale@gmail.com',
                status: User_1.Status.Online
            }, {
                firstName: 'Meenakshi', lastName: 'Maale', email: 'meenakshi.maale@gmail.com',
                status: User_1.Status.Online
            }], roomId: 124, createTimeStamp: 1694557650776
    }
];
// Route to get a list of users
router.get('/chatRooms', (req, res) => {
    res.json(chatRooms);
});
// Route to add a new user
router.post('/chatRooms', (req, res) => {
    const newChatRoom = {
        roomName: 'Chat Room Prod Deployment', users: [{
                firstName: 'Akshaj', lastName: 'Maale', email: 'akshaj.maale@gmail.com',
                status: User_1.Status.Online
            }, {
                firstName: 'Meenakshi', lastName: 'Maale', email: 'meenakshi.maale@gmail.com',
                status: User_1.Status.Online
            }], roomId: 124, createTimeStamp: 1694557650776
    };
    chatRooms.push(newChatRoom);
    res.json(newChatRoom);
});
exports.default = router;
