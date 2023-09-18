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
// Route to get a list of users
router.get('/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Access query parameters using req.query
    const roomId = req.query.roomId;
    const timeStamp = req.query.timeStamp;
    const db = yield (0, mongoDBConnection_1.connectToMongoDB)();
    const collection = db.collection('realtimeChat');
    let messages = [];
    if (roomId && !isNaN(parseFloat(roomId)) && timeStamp && !isNaN(parseFloat(timeStamp))) {
        messages = yield collection.find({ type: 'message', roomId: parseFloat(roomId), timeStamp: parseFloat(timeStamp) }).toArray();
    }
    else if (roomId && !isNaN(parseFloat(roomId))) {
        messages = yield collection.find({ type: 'message', roomId: parseFloat(roomId) }).toArray();
    }
    else {
        messages = yield collection.find({ type: 'message' }).toArray();
    }
    res.json(messages === null || messages === void 0 ? void 0 : messages.map((messageObj) => {
        const { _id, type } = messageObj, newMessageObj = __rest(messageObj, ["_id", "type"]);
        return newMessageObj;
    }));
}));
// Route to add a new message
router.post('/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = req.body;
        const db = yield (0, mongoDBConnection_1.connectToMongoDB)();
        const collection = db.collection('realtimeChat');
        yield collection.insertOne(Object.assign(Object.assign({}, message), { type: 'message' }));
        const messages = yield collection.find({ type: 'message', roomId: message.roomId }).toArray();
        res.json(messages === null || messages === void 0 ? void 0 : messages.map((messageObj) => {
            const { _id, type } = messageObj, newMessageObj = __rest(messageObj, ["_id", "type"]);
            return newMessageObj;
        }));
    }
    catch (error) {
        res.status(500).json({ error: 'Error while creating the message.' });
    }
}));
exports.default = router;
