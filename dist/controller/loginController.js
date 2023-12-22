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
const jwtconfig_1 = __importDefault(require("../config/jwtconfig"));
const userModel_1 = __importDefault(require("../models/userModel"));
const errorHandling_1 = require("./errorHandling");
const node_cache_1 = __importDefault(require("node-cache"));
const medicalPersonnelModel_1 = __importDefault(require("../models/medicalPersonnelModel"));
const failedLoginAttemptsCache = new node_cache_1.default({ stdTTL: 600 });
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usernameOrEmail, password } = req.body;
        let userData = null;
        const userEmail = yield userModel_1.default.findOne({ email: usernameOrEmail });
        const userUsername = yield userModel_1.default.findOne({ username: usernameOrEmail });
        const personnelEmail = yield medicalPersonnelModel_1.default.findOne({ email: usernameOrEmail });
        const personnelUsername = yield medicalPersonnelModel_1.default.findOne({ username: usernameOrEmail });
        if (usernameOrEmail.includes('@')) {
            userData = userEmail || personnelEmail;
        }
        else {
            userData = userUsername || personnelUsername;
        }
        const failedAttempts = failedLoginAttemptsCache.get(usernameOrEmail);
        if (failedAttempts !== undefined && failedAttempts >= 5) {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, 'Too many failed login attempts'));
        }
        if (userData) {
            const passwordCheck = yield bcrypt_1.default.compare(password, userData.password);
            if (passwordCheck) {
                let refreshToken = req.cookies.refresh_token;
                if (!refreshToken) {
                    refreshToken = jsonwebtoken_1.default.sign({ username: userData.username, id: userData._id, role: userData.role }, jwtconfig_1.default, { expiresIn: '7d' });
                }
                const accessToken = jsonwebtoken_1.default.sign({ username: userData.username, id: userData._id, role: userData.role }, jwtconfig_1.default, { expiresIn: '24h' });
                // Reset limit login
                failedLoginAttemptsCache.del(usernameOrEmail);
                // Expiration time for tokens
                const accessTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
                const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
                // Cookies
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
                userData.password = undefined;
                return res.status(200).json((0, errorHandling_1.errorHandling)({
                    message: `${userData.username} Successfully logged in as ${userData.role}`,
                    data: userData,
                    accessToken,
                    accessTokenExpiration,
                    refreshToken,
                    refreshTokenExpiration,
                }, null));
            }
            else {
                const newFailedAttempts = (failedAttempts || 0) + 1;
                failedLoginAttemptsCache.set(usernameOrEmail, newFailedAttempts);
                return res.status(400).json((0, errorHandling_1.errorHandling)(null, 'Incorrect Password or Username/Email'));
            }
        }
        else {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, 'User not found. Please check your credentials.'));
        }
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
