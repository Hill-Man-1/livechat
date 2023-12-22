import mongoose, { Schema, Types } from 'mongoose';
import MedicalFacilityModel from './medicalFacilityModel';

const roles = ['medical_admin', 'doctor'];
const specializations = ["Administration",'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology',
    'Pediatrics', 'Emergency Medicine', 'Internal Medicine', 'Surgery', 'Radiology',
    'Ophthalmology', 'Obstetrics and Gynecology', 'Psychiatry', 'Anesthesiology', 'Oncology',
    'Urology', 'Gastroenterology', 'Endocrinology'];

const medicalPersonnelSchema = new Schema({
    first_name: { type: String, required: true, minlength: 3, maxlength: 30 },
    last_name: { type: String, required: true, minlength: 3, maxlength: 30 },
    username: { type: String, required: true, minlength: 4, maxlength: 200, unique: true },
    email: { type: String, required: true, minlength: 3, maxlength: 200, unique: true },
    password: { type: String, required: true, minlength: 3, maxlength: 200 },
    specialization: { type: String, required: true, enum: specializations },
    hospital: { type: Types.ObjectId, ref: MedicalFacilityModel, required: true },
    role: { type: String, required: true, enum: roles },
}, {
    timestamps: true,
});

const MedicalPersonnelModel = mongoose.model('MedicalPersonnel', medicalPersonnelSchema);

export default MedicalPersonnelModel;
