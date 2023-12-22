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
exports.adminDashboard = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const medicalPersonnelModel_1 = __importDefault(require("../models/medicalPersonnelModel"));
const medicalFacilityModel_1 = __importDefault(require("../models/medicalFacilityModel"));
const errorHandling_1 = require("./errorHandling");
const adminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalPatients = yield userModel_1.default.countDocuments({ role: 'patient' });
        const totalDoctors = yield medicalPersonnelModel_1.default.countDocuments({ role: 'doctor' });
        const totalMedicalAdmins = yield medicalPersonnelModel_1.default.countDocuments({ role: 'medical_admin' });
        const totalStaffAdmins = yield userModel_1.default.countDocuments({ role: ['staff', 'admin'] });
        const totalMedicalFacilities = yield medicalFacilityModel_1.default.countDocuments();
        return res.status(200).json((0, errorHandling_1.errorHandling)({
            message: 'Dashboard Data',
            data: {
                "Total Patients": totalPatients,
                "Total Doctors": totalDoctors,
                "Total Medical Admins": totalMedicalAdmins,
                "Total Staff and Admins": totalStaffAdmins,
                "Total Medical Facilities": totalMedicalFacilities,
            }
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.adminDashboard = adminDashboard;
const getTotalPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalPatients = yield userModel_1.default.countDocuments({ role: 'patient' });
        res.status(200).json({
            message: 'Patients total count',
            data: totalPatients,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
const getOnlinePatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const onlinePatients = yield userModel_1.default.countDocuments({
            role: 'patient',
            lastSeen: { $gte: new Date(Date.now() - 15 * 60 * 1000) },
        });
        res.status(200).json({
            message: 'Online Patients count',
            data: onlinePatients,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
const getTotalMedicalPersonnel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalMedicalPersonnel = yield medicalPersonnelModel_1.default.countDocuments();
        res.status(200).json({
            message: 'Medical Personnel total count',
            data: totalMedicalPersonnel,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
const getTotalMedicalFacilities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalMedicalFacilities = yield medicalFacilityModel_1.default.countDocuments();
        res.status(200).json({
            message: 'Medical Facilities total count',
            data: totalMedicalFacilities,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
