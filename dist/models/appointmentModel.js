"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const medicalFacilityModel_1 = __importDefault(require("./medicalFacilityModel"));
const userModel_1 = __importDefault(require("./userModel"));
const medicalPersonnelModel_1 = __importDefault(require("./medicalPersonnelModel"));
const status = ['pending', "scheduled", 'completed', 'cancelled'];
const specializations = ['Cardiology', 'Dermatology', 'Orthopedics', 'Neurology',
    'Pediatrics', 'Emergency Medicine', 'Internal Medicine', 'Surgery', 'Radiology',
    'Ophthalmology', 'Obstetrics and Gynecology', 'Psychiatry', 'Anesthesiology', 'Oncology',
    'Urology', 'Gastroenterology', 'Endocrinology'];
const appointmentSchema = new mongoose_1.Schema({
    patient: { type: mongoose_1.Types.ObjectId, ref: userModel_1.default, required: true },
    doctor: { type: mongoose_1.Types.ObjectId, ref: medicalPersonnelModel_1.default, required: true },
    hospital: { type: mongoose_1.Types.ObjectId, ref: medicalFacilityModel_1.default, required: true },
    date: { type: Date, required: true, minlength: 8, maxlength: 200 },
    description: { type: String, required: true, minlength: 8, maxlength: 200 },
    category: { type: String, required: true, enum: specializations },
    status: { type: String, enum: status, default: "pending" },
}, {
    timestamps: true,
});
const AppointmentModel = mongoose_1.default.model('Appointment', appointmentSchema);
exports.default = AppointmentModel;
