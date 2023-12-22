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
exports.resetPassword = exports.resetPasswordRequest = void 0;
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const node_cache_1 = __importDefault(require("node-cache"));
const userModel_1 = __importDefault(require("../models/userModel"));
const errorHandling_1 = require("./errorHandling");
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const resetPasswordCache = new node_cache_1.default({ stdTTL: 300 });
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASS,
    },
});
const resetPasswordRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!validator_1.default.isEmail(email)) {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, 'Invalid email format'));
        }
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, 'User not found'));
        }
        const resetKey = Math.random().toString(36).substring(2, 15);
        resetPasswordCache.set(resetKey, email);
        const link = process.env.LINK;
        const mailOptions = {
            from: process.env.NODEMAILER_MAIL,
            to: email,
            subject: 'Password Reset',
            html: `<p>Click the following link to reset your password: <a href="${link}/api/v1/auth/resetpassword?token=${resetKey}">Reset Password</a></p>`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Failed to send reset email:', error);
                return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Failed to send reset email'));
            }
            console.log('Reset email sent successfully:', info);
            return res.status(200).json((0, errorHandling_1.errorHandling)(`Password reset request sent to ${email} with ${resetKey}`, null));
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Password reset request failed'));
    }
});
exports.resetPasswordRequest = resetPasswordRequest;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const resetKey = req.query.token;
        const email = resetPasswordCache.get(resetKey);
        if (!email) {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, 'Invalid token'));
        }
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, 'User not found'));
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        user.password = hashedPassword;
        yield user.save();
        resetPasswordCache.del(resetKey);
        return res.status(200).json((0, errorHandling_1.errorHandling)('Password reset success', null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Password reset failed'));
    }
});
exports.resetPassword = resetPassword;
