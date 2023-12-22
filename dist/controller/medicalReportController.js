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
exports.getMedicalReports = exports.createMedicalReport = void 0;
const medicalReportModel_1 = __importDefault(require("../models/medicalReportModel"));
const appointmentModel_1 = __importDefault(require("../models/appointmentModel"));
const errorHandling_1 = require("./errorHandling");
const medicalPersonnelModel_1 = __importDefault(require("../models/medicalPersonnelModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const medicalFacilityModel_1 = __importDefault(require("../models/medicalFacilityModel"));
const createMedicalReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { appointmentId, doctor_note } = req.body;
        if (!appointmentId || !doctor_note) {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, 'Invalid medical report data.'));
        }
        const appointment = yield appointmentModel_1.default.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json((0, errorHandling_1.errorHandling)(null, 'Associated appointment not found.'));
        }
        const reportDate = new Date();
        const newMedicalReport = new medicalReportModel_1.default({
            appointment: appointmentId,
            doctor: appointment.doctor,
            patient: appointment.patient,
            hospital: appointment.hospital,
            category: appointment.category,
            description: appointment.description,
            appointmentDate: appointment.date,
            reportDate,
            doctor_note,
        });
        yield newMedicalReport.save();
        const doctor = yield medicalPersonnelModel_1.default.findById(appointment.doctor);
        const patient = yield userModel_1.default.findById(appointment.patient);
        const hospital = yield medicalFacilityModel_1.default.findById(appointment.hospital);
        const reportData = {
            reportDate,
            appointment,
            appointmentDate: appointment.date,
            category: appointment.category,
            patient: (patient === null || patient === void 0 ? void 0 : patient.first_name) + " " + (patient === null || patient === void 0 ? void 0 : patient.last_name),
            doctor: (doctor === null || doctor === void 0 ? void 0 : doctor.first_name) + " " + (doctor === null || doctor === void 0 ? void 0 : doctor.last_name),
            hospital: hospital === null || hospital === void 0 ? void 0 : hospital.name,
            doctor_note,
        };
        return res.status(201).json((0, errorHandling_1.errorHandling)({
            message: 'Medical report successfully created',
            data: reportData,
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.createMedicalReport = createMedicalReport;
const getMedicalReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        let medicalReports = null;
        if (user.role === 'patient') {
            medicalReports = yield medicalReportModel_1.default.find({ patient: user.id });
        }
        else if (user.role === 'medical_admin') {
            const personnel = yield medicalPersonnelModel_1.default.findById(user.id);
            medicalReports = yield medicalReportModel_1.default.find({ hospital: personnel === null || personnel === void 0 ? void 0 : personnel.hospital });
        }
        else if (user.role === 'doctor') {
            medicalReports = yield medicalReportModel_1.default.find({ doctor: user.id });
        }
        else if (user.role === 'staff' || user.role === 'admin') {
            medicalReports = yield medicalReportModel_1.default.find();
        }
        else {
            return res.status(403).json((0, errorHandling_1.errorHandling)(null, 'Forbidden Access'));
        }
        const reportData = [];
        for (const report of medicalReports) {
            const appointment = yield appointmentModel_1.default.findById(report.appointment);
            const doctor = yield medicalPersonnelModel_1.default.findById(appointment === null || appointment === void 0 ? void 0 : appointment.doctor);
            const patient = yield userModel_1.default.findById(appointment === null || appointment === void 0 ? void 0 : appointment.patient);
            const hospital = yield medicalFacilityModel_1.default.findById(appointment === null || appointment === void 0 ? void 0 : appointment.hospital);
            const formattedReport = {
                _id: report._id,
                appointment: report.appointment,
                appointmentDate: report.appointmentDate,
                reportDate: report.reportDate,
                category: report.category,
                patient: (patient === null || patient === void 0 ? void 0 : patient.first_name) + " " + (patient === null || patient === void 0 ? void 0 : patient.last_name),
                doctor: (doctor === null || doctor === void 0 ? void 0 : doctor.first_name) + " " + (doctor === null || doctor === void 0 ? void 0 : doctor.last_name),
                hospital: hospital === null || hospital === void 0 ? void 0 : hospital.name,
                doctor_note: report.doctor_note,
            };
            reportData.push(formattedReport);
        }
        return res.status(200).json((0, errorHandling_1.errorHandling)({
            message: 'List of Medical Reports',
            data: reportData,
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getMedicalReports = getMedicalReports;
