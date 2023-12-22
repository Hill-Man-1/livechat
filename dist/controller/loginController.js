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
exports.logoutUser = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import JWT_TOKEN from '../config/jwtconfig';
const userModel_1 = __importDefault(require("../models/userModel"));
const errorHandling_1 = require("./errorHandling");
const node_cache_1 = __importDefault(require("node-cache"));
const medicalPersonnelModel_1 = __importDefault(require("../models/medicalPersonnelModel"));
const failedLoginAttemptsCache = new node_cache_1.default({ stdTTL: 600 });
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usernameOrEmail, password } = req.body;
        let user = yield userModel_1.default.findOne({ $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] });
        if (!user) {
            // Check if the user is a Medical Personnel
            user = yield medicalPersonnelModel_1.default.findOne({ $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] });
        }
        if (!usernameOrEmail || !password) {
            return res.status(400).json((0, errorHandling_1.errorHandling)('Username/Email and Password must be provided.', null));
        }
        // Check for too many failed login attempts
        const failedAttempts = failedLoginAttemptsCache.get(usernameOrEmail) || 0;
        if (failedAttempts >= 5) {
            return res.status(429).json((0, errorHandling_1.errorHandling)('Too many failed login attempts. Please try again later.', null));
        }
        // If user or personnel not found by email or username
        if (!user) {
            failedLoginAttemptsCache.set(usernameOrEmail, failedAttempts + 1, 600); // Increment failed attempts
            return res.status(404).json((0, errorHandling_1.errorHandling)('Incorrect Username/Email or Password', null));
        }
        // Check if the password is correct
        const passwordCheck = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordCheck) {
            failedLoginAttemptsCache.set(usernameOrEmail, failedAttempts + 1, 600); // Increment failed attempts
            return res.status(401).json((0, errorHandling_1.errorHandling)('Incorrect Username/Email or Password', null));
        }
        // Reset failed login attempts on success
        failedLoginAttemptsCache.del(usernameOrEmail);
        // Proceed with generating tokens and setting cookies
        const secretToken = process.env.SECRET_TOKEN;
        if (!secretToken) {
            return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Server error: missing token secret.'));
        }
        let refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            refreshToken = jsonwebtoken_1.default.sign({ username: user.username, id: user._id, role: user.role }, secretToken, { expiresIn: '7d' });
        }
        const accessToken = jsonwebtoken_1.default.sign({ username: user.username, id: user._id, role: user.role }, secretToken, { expiresIn: '24h' });
        // Expiration time for tokens
        const accessTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        // Cookies setup
        res.cookie('access_token', accessToken, {
            expires: accessTokenExpiration,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        res.cookie('refresh_token', refreshToken, {
            expires: refreshTokenExpiration,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        // Return user data without password
        return res.status(200).json({ _id: user._id, username: user.username, email: user.email, first_name: user.first_name, role: user.role });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Cannot Connect!! Internal Error!'));
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.status(200).json((0, errorHandling_1.errorHandling)("See you next time!", null));
});
exports.logoutUser = logoutUser;
