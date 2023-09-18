"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoDBConnection_1 = require("../mongoDB/mongoDBConnection");
const router = express_1.default.Router();
// Route to get list of chatRooms
router.get('/chatRooms', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, mongoDBConnection_1.connectToMongoDB)();
    const collection = db.collection('realtimeChat');
    const chatRooms = yield collection.find({ type: 'chatRoom' }).toArray();
    res.json(chatRooms === null || chatRooms === void 0 ? void 0 : chatRooms.map((chatRoomObj) => {
        const { _id, type } = chatRoomObj, newChatRoomObject = __rest(chatRoomObj, ["_id", "type"]);
        return newChatRoomObject;
    }));
}));
// Route to add a new chatRoom
router.post('/chatRooms', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatRoom = req.body;
        const db = yield (0, mongoDBConnection_1.connectToMongoDB)();
        const collection = db.collection('realtimeChat');
        const count = yield collection.countDocuments({ type: 'chatRoom' });
        const existingChatRoom = yield collection.findOne({ type: 'chatRoom', roomName: chatRoom.roomName });
        if (existingChatRoom && existingChatRoom.roomName === chatRoom.roomName) {
            res.status(409).json({ error: 'Error while creating chatRoom, duplicate roomName.' });
        }
        else {
            yield collection.insertOne(Object.assign(Object.assign({}, chatRoom), { roomId: count + 1, type: 'chatRoom' }));
            const chatRooms = yield collection.find({ type: 'chatRoom' }).toArray();
            res.json(chatRooms === null || chatRooms === void 0 ? void 0 : chatRooms.map((chatRoomObj) => {
                const { _id, type } = chatRoomObj, newChatRoomObject = __rest(chatRoomObj, ["_id", "type"]);
                return newChatRoomObject;
            }));
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error while inserting the user.' });
    }
}));
// Route to update a chatRoom
router.put('/chatRooms', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatRoomReq = req.body;
        const db = yield (0, mongoDBConnection_1.connectToMongoDB)();
        const collection = db.collection('realtimeChat');
        // const count = await collection.countDocuments({ type: 'chatRoom' });
        const chatRoom = yield collection.findOne({ type: 'chatRoom', roomId: chatRoomReq.roomId });
        if (chatRoom) {
            yield collection.updateOne({ _id: chatRoom === null || chatRoom === void 0 ? void 0 : chatRoom._id }, { $set: { users: chatRoomReq.users, lastUpdatedTimeStamp: chatRoomReq.lastUpdatedTimeStamp } });
            const chatRooms = yield collection.find({ type: 'chatRoom' }).toArray();
            res.json(chatRooms === null || chatRooms === void 0 ? void 0 : chatRooms.map((chatRoomObj) => {
                const { _id, type } = chatRoomObj, newChatRoomObj = __rest(chatRoomObj, ["_id", "type"]);
                return newChatRoomObj;
            }));
        }
        else {
            res.status(404).json({ error: 'Chat room not found.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error while inserting the user.' });
    }
}));
exports.default = router;
