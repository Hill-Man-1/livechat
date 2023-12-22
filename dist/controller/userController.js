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
exports.updateUser = exports.getPatientsList = exports.getUsersList = exports.getUserProfile = exports.getUserProfileByAdmin = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const errorHandling_1 = require("./errorHandling");
const getUserProfileByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield userModel_1.default.findById(userId);
        if (user) {
            return res.status(200).json((0, errorHandling_1.errorHandling)({
                message: `${user.username}'s Profile`,
                data: user
            }, null));
        }
        else {
            return res.status(404).json((0, errorHandling_1.errorHandling)(null, 'User not found.'));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getUserProfileByAdmin = getUserProfileByAdmin;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(403).json((0, errorHandling_1.errorHandling)(null, 'Access Forbidden.'));
        }
        const user = yield userModel_1.default.findById(userId).select('-password');
        if (user) {
            return res.status(200).json((0, errorHandling_1.errorHandling)({
                message: `${user.username}'s Profile`,
                data: user
            }, null));
        }
        else {
            return res.status(404).json((0, errorHandling_1.errorHandling)(null, 'User not found.'));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getUserProfile = getUserProfile;
const getUsersList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find().select('-password');
        return res.status(200).json((0, errorHandling_1.errorHandling)({
            message: "User List",
            data: users
        }, null));
        ;
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getUsersList = getUsersList;
const getPatientsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield userModel_1.default.find({ role: 'patient' }).select('-password');
        return res.status(200).json((0, errorHandling_1.errorHandling)({
            message: 'Patients List',
            data: patients,
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getPatientsList = getPatientsList;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    if (!userId) {
        return res.status(401).json((0, errorHandling_1.errorHandling)(null, 'Unauthorized: Please Login First!!'));
    }
    try {
        const user = yield userModel_1.default.findByIdAndUpdate(userId, { $set: req.body }, { new: true });
        if (!user) {
            return res.status(404).json((0, errorHandling_1.errorHandling)(null, 'User not found.'));
        }
        return res.status(200).json((0, errorHandling_1.errorHandling)({
            message: 'Patient Data successfully updated',
            data: user,
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.updateUser = updateUser;
