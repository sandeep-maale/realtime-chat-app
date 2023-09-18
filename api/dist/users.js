"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("./models/User");
const router = express_1.default.Router();
// Sample user data
const users = [
    { firstName: 'Sandeep', lastName: 'Maale', email: 'sandeep.maale@gmail.com', status: User_1.Status.Offline },
    { firstName: 'Akshaj', lastName: 'Maale', email: 'akshaj.maale@gmail.com', status: User_1.Status.Online },
    { firstName: 'Meenakshi', lastName: 'Maale', email: 'meenakshi.maale@gmail.com', status: User_1.Status.Offline },
];
// Route to get a list of users
router.get('/users', (req, res) => {
    res.json(users);
});
// Route to add a new user
router.post('/users', (req, res) => {
    const { name } = req.body;
    const newUser = { firstName: 'John', lastName: 'Doe', email: 'john.doe@gmail.com', status: User_1.Status.Online };
    users.push(newUser);
    res.json(newUser);
});
exports.default = router;
