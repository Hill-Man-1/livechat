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
const roles = ['medical_admin', 'doctor'];
const specializations = ["Administration", 'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology',
    'Pediatrics', 'Emergency Medicine', 'Internal Medicine', 'Surgery', 'Radiology',
    'Ophthalmology', 'Obstetrics and Gynecology', 'Psychiatry', 'Anesthesiology', 'Oncology',
    'Urology', 'Gastroenterology', 'Endocrinology'];
const medicalPersonnelSchema = new mongoose_1.Schema({
    first_name: { type: String, required: true, minlength: 3, maxlength: 30 },
    last_name: { type: String, required: true, minlength: 3, maxlength: 30 },
    username: { type: String, required: true, minlength: 4, maxlength: 200, unique: true },
    email: { type: String, required: true, minlength: 3, maxlength: 200, unique: true },
    password: { type: String, required: true, minlength: 3, maxlength: 200 },
    specialization: { type: String, required: true, enum: specializations },
    hospital: { type: mongoose_1.Types.ObjectId, ref: medicalFacilityModel_1.default, required: true },
    role: { type: String, required: true, enum: roles },
}, {
    timestamps: true,
});
const MedicalPersonnelModel = mongoose_1.default.model('MedicalPersonnel', medicalPersonnelSchema);
exports.default = MedicalPersonnelModel;
