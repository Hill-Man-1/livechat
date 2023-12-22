import mongoose, { Schema } from 'mongoose';

const medicalFacilitySchema = new Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, minlength: 10, maxlength: 200, unique: true },
    address: { type: String, required: true, minlength: 3, maxlength: 200 },
    contact: { type: String, required: true, minlength: 10, maxlength: 12 },
    location: {
        city: { type: String, required: true },
        province: { type: String, required: true },
    },
}, {
    timestamps: true,
});

const MedicalFacilityModel = mongoose.model('MedicalFacility', medicalFacilitySchema);

export default MedicalFacilityModel;
