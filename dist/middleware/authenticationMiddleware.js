"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtconfig_1 = __importDefault(require("../config/jwtconfig"));
const errorHandling_1 = require("../controller/errorHandling");
const authenMiddleware = (req, res, next) => {
    const authen = req.cookies.access_token;
    // const authen = req.headers.authorization
    if (!authen) {
        return res.status(400).json({ error: "Unauthorized Access!!" });
    }
    // else {
    //     const secretToken = authen.split(' ')[1]
    try {
        const decodedToken = jsonwebtoken_1.default.verify(authen, jwtconfig_1.default);
        console.log(decodedToken, `==== User's Decoded Data`);
        req.user = decodedToken;
        req.role = decodedToken.role;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "Can't Authenticate!! Internal Error!"));
    }
    // }
};
exports.default = authenMiddleware;
