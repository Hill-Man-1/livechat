import { Request, Response } from 'express';
import MedicalReportModel from '../models/medicalReportModel';
import AppointmentModel from '../models/appointmentModel';
import { errorHandling } from './errorHandling';
import MedicalPersonnelModel from '../models/medicalPersonnelModel';
import UserModel from '../models/userModel';
import MedicalFacilityModel from '../models/medicalFacilityModel';

const createMedicalReport = async (req: Request, res: Response) => {
    try {
      const { appointmentId, doctor_note } = req.body;
  
      if (!appointmentId || !doctor_note) {
        return res.status(400).json(errorHandling(null, 'Invalid medical report data.'));
      }
  
      const appointment = await AppointmentModel.findById(appointmentId);
  
      if (!appointment) {
        return res.status(404).json(errorHandling(null, 'Associated appointment not found.'));
      }
  
      const reportDate = new Date()
  
      const newMedicalReport = new MedicalReportModel({
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
  
      await newMedicalReport.save();
      const doctor = await MedicalPersonnelModel.findById(appointment.doctor);
      const patient = await UserModel.findById(appointment.patient);
      const hospital = await MedicalFacilityModel.findById(appointment.hospital);
  
      const reportData = {
        reportDate,
        appointment,
        appointmentDate: appointment.date,
        category: appointment.category,
        patient: patient?.first_name + " " + patient?.last_name,
        doctor: doctor?.first_name + " " + doctor?.last_name,
        hospital: hospital?.name,
        doctor_note,
      };
  
      return res.status(201).json(
        errorHandling({
          message: 'Medical report successfully created',
          data: reportData,
        }, null)
      );
      
    } catch (error) {
      console.error(error);
      return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
  };
  

  const getMedicalReports = async (req: Request, res: Response) => {
    try {
      const user = req.user;
      let medicalReports = null;
  
      if (user.role === 'patient') {
        medicalReports = await MedicalReportModel.find({ patient: user.id });
      } else if (user.role === 'medical_admin') {
        const personnel = await MedicalPersonnelModel.findById(user.id);
        medicalReports = await MedicalReportModel.find({ hospital: personnel?.hospital });
      } else if (user.role === 'doctor') {
        medicalReports = await MedicalReportModel.find({ doctor: user.id });
      } else if (user.role === 'staff' || user.role === 'admin') {
        medicalReports = await MedicalReportModel.find();
      } else {
        return res.status(403).json(errorHandling(null, 'Forbidden Access'));
      }
  
      const reportData = [] as any[];

    for (const report of medicalReports) {
      const appointment = await AppointmentModel.findById(report.appointment);
      const doctor = await MedicalPersonnelModel.findById(appointment?.doctor);
      const patient = await UserModel.findById(appointment?.patient);
      const hospital = await MedicalFacilityModel.findById(appointment?.hospital);

      const formattedReport = {
        _id: report._id,
        appointment: report.appointment,
        appointmentDate: report.appointmentDate,
        reportDate: report.reportDate,
        category: report.category,
        patient: patient?.first_name + " " + patient?.last_name,
        doctor: doctor?.first_name + " " + doctor?.last_name,
        hospital: hospital?.name,
        doctor_note: report.doctor_note,
      };

      reportData.push(formattedReport);
    }

    return res.status(200).json(
      errorHandling({
        message: 'List of Medical Reports',
        data: reportData,
      }, null)
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
  }
};

export { createMedicalReport, getMedicalReports };