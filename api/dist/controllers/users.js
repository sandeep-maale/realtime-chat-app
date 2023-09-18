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
// Route to get a user
router.get('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Access query parameters using req.query
    const email = req.query.email;
    const password = req.query.password;
    const db = yield (0, mongoDBConnection_1.connectToMongoDB)();
    const collection = db.collection('realtimeChat');
    const user = yield collection.findOne({ type: 'user', email: email });
    if (user) {
        if (user.password === password) {
            const { _id, password, type } = user, newUser = __rest(user, ["_id", "password", "type"]);
            res.json(Object.assign({}, newUser));
        }
        else {
            res.status(400).json({ error: 'Entered wrong password, please check.' });
        }
    }
    else {
        res.status(404).json({ error: 'User not found with the email id.' });
    }
}));
// Route to get a list of users
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, mongoDBConnection_1.connectToMongoDB)();
    const collection = db.collection('realtimeChat');
    const users = yield collection.find({ type: 'user' }).toArray();
    res.json(users === null || users === void 0 ? void 0 : users.map((userObj) => {
        const { _id, password, type } = userObj, newUserObject = __rest(userObj, ["_id", "password", "type"]);
        return newUserObject;
    }));
}));
// Route to add a new user
router.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const db = yield (0, mongoDBConnection_1.connectToMongoDB)();
        const collection = db.collection('realtimeChat');
        yield collection.insertOne(Object.assign(Object.assign({}, user), { type: 'user' }));
        const users = yield collection.find({ type: 'user' }).toArray();
        res.json(users === null || users === void 0 ? void 0 : users.map((userObj) => {
            const { _id, password, type } = userObj, newUserObject = __rest(userObj, ["_id", "password", "type"]);
            return newUserObject;
        }));
    }
    catch (error) {
        res.status(500).json({ error: 'Error while inserting the user.' });
    }
}));
// Route to add a new user
router.put('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userReq = req.body;
        const db = yield (0, mongoDBConnection_1.connectToMongoDB)();
        const collection = db.collection('realtimeChat');
        const user = yield collection.findOne({ type: 'user', email: userReq.email });
        if (user) {
            yield collection.updateOne({ _id: user === null || user === void 0 ? void 0 : user._id }, { $set: { status: userReq.status } });
            const users = yield collection.find({ type: 'user' }).toArray();
            res.json(users === null || users === void 0 ? void 0 : users.map((userObj) => {
                const { _id, password, type } = userObj, newUserObject = __rest(userObj, ["_id", "password", "type"]);
                return newUserObject;
            }));
        }
        else {
            res.status(404).json({ error: 'User not found.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error while inserting the user.' });
    }
}));
router.get('/fetchAll', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, mongoDBConnection_1.connectToMongoDB)();
        const collection = db.collection('realtimeChat');
        const data = yield collection.find().toArray();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error while inserting the user.' });
    }
}));
exports.default = router;
