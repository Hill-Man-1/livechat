import mongoose, { Schema, Types } from 'mongoose';
import MedicalFacilityModel from './medicalFacilityModel';
import UserModel from './userModel';
import MedicalPersonnelModel from './medicalPersonnelModel';

const status = ['pending', "scheduled", 'completed', 'cancelled'];
const specializations = ['Cardiology', 'Dermatology', 'Orthopedics', 'Neurology',
    'Pediatrics', 'Emergency Medicine', 'Internal Medicine', 'Surgery', 'Radiology',
    'Ophthalmology', 'Obstetrics and Gynecology', 'Psychiatry', 'Anesthesiology', 'Oncology',
    'Urology', 'Gastroenterology', 'Endocrinology'];

const appointmentSchema = new Schema({
    patient: { type: Types.ObjectId, ref: UserModel, required: true },
    doctor: { type: Types.ObjectId, ref: MedicalPersonnelModel, required: true },
    hospital: { type: Types.ObjectId, ref: MedicalFacilityModel, required: true },
    date: { type: Date, required: true, minlength: 8, maxlength: 200 },
    
    description: { type: String, required: true, minlength: 8, maxlength: 200 },
    category: { type: String, required: true, enum: specializations },
    status: { type: String, enum: status, default: "pending" },
}, {
    timestamps: true,
});

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

export default AppointmentModel;
