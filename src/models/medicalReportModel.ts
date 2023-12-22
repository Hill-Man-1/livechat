import mongoose, { Schema, Types } from 'mongoose';
import UserModel from './userModel';
import MedicalPersonnelModel from './medicalPersonnelModel';
import MedicalFacilityModel from './medicalFacilityModel';
import AppointmentModel from './appointmentModel';

const medicalReportSchema = new Schema(
  {
    appointment: { type: Types.ObjectId, ref: AppointmentModel, required: true },
    doctor: { type: Types.ObjectId, ref: MedicalPersonnelModel, required: true },
    patient: { type: Types.ObjectId, ref: UserModel, required: true },
    hospital: { type: Types.ObjectId, ref: MedicalFacilityModel, required: true },
    appointmentDate: { type: Date, ref: MedicalFacilityModel, required: true },
    reportDate: { type: Date, default: Date.now, required: true },
    doctor_note: { type: String },
    category: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

medicalReportSchema.pre('save', async function (next) {
  try {
    const appointment = await AppointmentModel.findById(this.appointment);

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
  } catch (error) {
    console.error(error)
  }
});

const MedicalReportModel = mongoose.model('MedicalReport', medicalReportSchema);

export default MedicalReportModel;