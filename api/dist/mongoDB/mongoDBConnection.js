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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDB = void 0;
const mongodb_1 = require("mongodb");
// MongoDB connection URI (replace with your own)
const uri = 'mongodb://localhost:27017/chatbot';
let client = null;
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!client) {
                client = new mongodb_1.MongoClient(uri);
                yield client.connect();
                console.log('Connected to MongoDB');
            }
            return client.db();
        }
        catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    });
}
exports.connectToMongoDB = connectToMongoDB;
