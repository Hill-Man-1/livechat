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
exports.updatePersonnel = exports.getPersonnelsList = exports.getMedicalAdminList = exports.getDoctorsList = exports.getMedicalPersonnelProfile = exports.getDoctorProfile = void 0;
const medicalPersonnelModel_1 = __importDefault(require("../models/medicalPersonnelModel"));
const errorHandling_1 = require("./errorHandling");
const getDoctorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.params.doctorId;
        const doctor = yield medicalPersonnelModel_1.default.findById(doctorId).select('-password');
        if (doctor) {
            return res.status(200).json((0, errorHandling_1.errorHandling)({
                message: `${doctor.username}'s Profile`,
                data: doctor
            }, null));
        }
        else {
            return res.status(404).json((0, errorHandling_1.errorHandling)(null, 'Doctor/Specialist not found.'));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getDoctorProfile = getDoctorProfile;
const getMedicalPersonnelProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const medicalPersonnelId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!medicalPersonnelId) {
            return res.status(403).json((0, errorHandling_1.errorHandling)(null, 'Forbidden Access'));
        }
        const medicalPersonnel = yield medicalPersonnelModel_1.default.findById(medicalPersonnelId).select('-password');
        if (medicalPersonnel) {
            return res.status(200).json((0, errorHandling_1.errorHandling)({
                message: `${medicalPersonnel.username}'s Profile`,
                data: medicalPersonnel
            }, null));
        }
        else {
            return res.status(404).json((0, errorHandling_1.errorHandling)(null, 'Medical personnel not found.'));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getMedicalPersonnelProfile = getMedicalPersonnelProfile;
const getDoctorsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield medicalPersonnelModel_1.default.find({ role: 'doctor' }).select('-password');
        return res.status(200).json((0, errorHandling_1.errorHandling)({
            message: "List of Doctors and Specialists",
            data: doctors
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getDoctorsList = getDoctorsList;
const getMedicalAdminList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medical_admins = yield medicalPersonnelModel_1.default.find({ role: 'medical_admin' }).select('-password');
        return res.status(200).json((0, errorHandling_1.errorHandling)({
            message: "List of Medical Admins",
            data: medical_admins
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getMedicalAdminList = getMedicalAdminList;
const getPersonnelsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personnels = yield medicalPersonnelModel_1.default.find().select('-password');
        return res.status(200).json((0, errorHandling_1.errorHandling)({
            message: "List of Medical Personnels",
            data: personnels
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getPersonnelsList = getPersonnelsList;
const updatePersonnel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const personnelId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    try {
        const personnel = yield medicalPersonnelModel_1.default.findById(personnelId);
        if (!personnel) {
            return res.status(403).json((0, errorHandling_1.errorHandling)(null, 'Forbidden Access'));
        }
        const updatedPersonnel = yield medicalPersonnelModel_1.default.findByIdAndUpdate(personnelId, { $set: req.body }, { new: true });
        return res.status(200).json((0, errorHandling_1.errorHandling)({
            message: 'Personnel Data successfully Updated',
            data: updatedPersonnel,
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.updatePersonnel = updatePersonnel;
