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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const uri = process.env.URI;
const mongoMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let client = null;
    try {
        console.log("MongoDB Connection Start..!");
        client = yield mongoose_1.default.connect(uri);
        if (client.connection.readyState === 1) {
            const db = client.connection;
            req.db = db;
            console.log("MongoDB Connection Succeed..!");
            next();
        }
        else {
            console.log("MongoDB Connection Failed...");
            next();
        }
    }
    catch (error) {
        console.log("MongoDB Connection Failed..:", error);
        next(error);
    }
    res.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
        if (client) {
            yield client.connection.close();
            console.log("MongoDB Connection Closed..!");
        }
    }));
});
exports.default = mongoMiddleware;
