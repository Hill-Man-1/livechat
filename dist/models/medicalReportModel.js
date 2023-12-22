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
const mongoose_1 = __importStar(require("mongoose"));
const userModel_1 = __importDefault(require("./userModel"));
const medicalPersonnelModel_1 = __importDefault(require("./medicalPersonnelModel"));
const medicalFacilityModel_1 = __importDefault(require("./medicalFacilityModel"));
const appointmentModel_1 = __importDefault(require("./appointmentModel"));
const medicalReportSchema = new mongoose_1.Schema({
    appointment: { type: mongoose_1.Types.ObjectId, ref: appointmentModel_1.default, required: true },
    doctor: { type: mongoose_1.Types.ObjectId, ref: medicalPersonnelModel_1.default, required: true },
    patient: { type: mongoose_1.Types.ObjectId, ref: userModel_1.default, required: true },
    hospital: { type: mongoose_1.Types.ObjectId, ref: medicalFacilityModel_1.default, required: true },
    appointmentDate: { type: Date, ref: medicalFacilityModel_1.default, required: true },
    reportDate: { type: Date, default: Date.now, required: true },
    doctor_note: { type: String },
    category: { type: String, required: true },
    description: { type: String, required: true },
}, {
    timestamps: true,
});
medicalReportSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appointment = yield appointmentModel_1.default.findById(this.appointment);
            if (!appointment) {
                throw new Error('Associated appointment not found');
            }
            this.doctor = appointment.doctor;
            this.patient = appointment.patient;
            this.hospital = appointment.hospital;
            this.category = appointment.category;
            this.description = appointment.description;
            this.appointmentDate = appointment.date;
            next();
        }
        catch (error) {
            console.error(error);
        }
    });
});
const MedicalReportModel = mongoose_1.default.model('MedicalReport', medicalReportSchema);
exports.default = MedicalReportModel;
