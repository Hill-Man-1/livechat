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
exports.updateAppointmentStatus = exports.cancelAppointment = exports.getAppointmentList = exports.updateAppointment = exports.createAppointment = void 0;
const date_fns_1 = require("date-fns");
const appointmentModel_1 = __importDefault(require("../models/appointmentModel"));
const errorHandling_1 = require("./errorHandling");
const medicalFacilityModel_1 = __importDefault(require("../models/medicalFacilityModel"));
const medicalPersonnelModel_1 = __importDefault(require("../models/medicalPersonnelModel"));
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const patient = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { doctor, hospital, category, date, description } = req.body;
        if (!patient || !doctor || !hospital || !category || !date || !description) {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, 'Invalid appointment data.'));
        }
        const parsedDate = new Date(date);
        const formattedDate = (0, date_fns_1.format)(parsedDate, 'yyyy-MM-dd HH:mm:ss');
        const medicalFacility = yield medicalFacilityModel_1.default.findById(hospital);
        if (!medicalFacility) {
            return res.status(404).json((0, errorHandling_1.errorHandling)(null, 'Medical facility not not found.'));
        }
        const appointment = yield appointmentModel_1.default.create({
            patient,
            doctor,
            hospital,
            date: formattedDate,
            description,
            category
        });
        return res.status(201).json((0, errorHandling_1.errorHandling)({
            message: 'Appointment successfully created',
            data: appointment,
            location: medicalFacility.name + ', ' + ((_b = medicalFacility.location) === null || _b === void 0 ? void 0 : _b.city),
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.createAppointment = createAppointment;
const updateAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const id = req.params.appointmentId;
    const user = req.user;
    try {
        const appointment = yield appointmentModel_1.default.findById(id);
        const medicalFacility = yield medicalFacilityModel_1.default.findOne();
        const medicalPersonnel = yield medicalPersonnelModel_1.default.findById(user.id);
        if (!appointment) {
            return res.status(404).json((0, errorHandling_1.errorHandling)(null, 'Appointment not found.'));
        }
        if ((medicalPersonnel === null || medicalPersonnel === void 0 ? void 0 : medicalPersonnel.role) !== 'medical_admin' && appointment.status !== 'pending') {
            return res.status(403).json((0, errorHandling_1.errorHandling)(null, `Scheduled Appointment cannot be updated. Please contact our medical team through live chat, call ${medicalFacility === null || medicalFacility === void 0 ? void 0 : medicalFacility.contact}, or email us at ${medicalFacility === null || medicalFacility === void 0 ? void 0 : medicalFacility.email}. We will get back to you as soon as possible!`));
        }
        const updatedAppointment = yield appointmentModel_1.default.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        res.status(200).json({
            message: 'Appointment details successfully Updated',
            data: updatedAppointment,
            location: (medicalFacility === null || medicalFacility === void 0 ? void 0 : medicalFacility.name) + ', ' + ((_c = medicalFacility === null || medicalFacility === void 0 ? void 0 : medicalFacility.location) === null || _c === void 0 ? void 0 : _c.city),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.updateAppointment = updateAppointment;
const getAppointmentList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let appointments = null;
    try {
        if (user.role === "patient") {
            appointments = yield appointmentModel_1.default.find({ patient: user.id });
        }
        else if (user.role === "medical_admin") {
            const personnel = yield medicalPersonnelModel_1.default.findById(user.id);
            appointments = yield appointmentModel_1.default.find({ hospital: personnel === null || personnel === void 0 ? void 0 : personnel.hospital });
            console.log("user:", user, "personnel:", personnel, "hospital id:", personnel === null || personnel === void 0 ? void 0 : personnel.hospital);
        }
        else if (user.role === "doctor") {
            const personnel = yield medicalPersonnelModel_1.default.findById(user.id);
            appointments = yield appointmentModel_1.default.find({
                hospital: personnel === null || personnel === void 0 ? void 0 : personnel.hospital,
                doctor: personnel === null || personnel === void 0 ? void 0 : personnel.id,
                status: { $in: ['scheduled', 'completed'] },
            });
        }
        else if ((user === null || user === void 0 ? void 0 : user.role) === 'staff' || (user === null || user === void 0 ? void 0 : user.role) === 'admin') {
            appointments = yield appointmentModel_1.default.find();
        }
        else {
            return res.status(403).json((0, errorHandling_1.errorHandling)(null, 'Forbidden Access'));
        }
        return res.status(200).json((0, errorHandling_1.errorHandling)({
            message: 'List of Appointments',
            data: appointments,
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getAppointmentList = getAppointmentList;
const cancelAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.appointmentId;
    const { status } = req.body;
    const user = req.user;
    try {
        const appointment = yield appointmentModel_1.default.findById(id);
        if (!appointment) {
            return res.status(404).json((0, errorHandling_1.errorHandling)(null, 'Appointment not found.'));
        }
        if (user.role === 'patient' && appointment.status === 'pending' && status === 'cancelled') {
            const updatedAppointment = yield appointmentModel_1.default.findByIdAndUpdate(id, { $set: { status } }, { new: true });
            return res.status(200).json({
                message: 'Appointment Successfully Cancelled..',
                data: updatedAppointment,
            });
        }
        else {
            return res.status(404).json({
                message: `Mr/Ms.${user.last_name} has yet to book an appointment..`
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.cancelAppointment = cancelAppointment;
const updateAppointmentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.appointmentId;
    const { status } = req.body;
    try {
        const appointment = yield appointmentModel_1.default.findById(id);
        if (!appointment) {
            return res.status(404).json((0, errorHandling_1.errorHandling)(null, 'Appointment not found.'));
        }
        const updatedAppointment = yield appointmentModel_1.default.findByIdAndUpdate(id, { $set: { status } }, { new: true });
        return res.status(200).json({
            message: 'Appointment Status successfully updated',
            data: updatedAppointment,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.updateAppointmentStatus = updateAppointmentStatus;
