"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const Origin = [
    "http://localhost:5173",
    "http://localhost:5000",
    "https://657b2d9cc6a15d3745879ecb--prismatic-raindrop-418199.netlify.app/"
];
const corsOptionsDelegate = (req, callback) => {
    const clientOrigin = Origin.includes(req.header("Origin"));
    const requestOrigin = req.header("Origin");
    console.log("Request Origin: ", requestOrigin);
    if (clientOrigin) {
        callback(null, {
            origin: true,
            methods: "GET, POST, PUT, PATCH, DELETE",
            credentials: true,
        });
    }
    else {
        callback(new Error("CORS Unauthorized Access..!"));
    }
};
const corsMiddleware = (app) => {
    app.use((0, cors_1.default)(corsOptionsDelegate));
};
exports.default = corsMiddleware;
