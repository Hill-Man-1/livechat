import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import MedicalPersonnelModel from '../models/medicalPersonnelModel';
import MedicalFacilityModel from '../models/medicalFacilityModel';
import { errorHandling } from './errorHandling';

const adminDashboard = async (req: Request, res: Response) => {
    try {
      const totalPatients = await UserModel.countDocuments({ role: 'patient' });
      const totalDoctors = await MedicalPersonnelModel.countDocuments({ role: 'doctor' });
      const totalMedicalAdmins = await MedicalPersonnelModel.countDocuments({ role: 'medical_admin' });
      const totalStaffAdmins = await UserModel.countDocuments({ role: ['staff', 'admin'] });
      const totalMedicalFacilities = await MedicalFacilityModel.countDocuments();
  
      return res.status(200).json(errorHandling({
            message: 'Dashboard Data',
            data: {
                "Total Patients": totalPatients,
                "Total Doctors": totalDoctors,
                "Total Medical Admins": totalMedicalAdmins,
                "Total Staff and Admins": totalStaffAdmins,
                "Total Medical Facilities": totalMedicalFacilities,
            }}, null));
      
    } catch (error) {
      console.error(error);
      return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
  };
  
  
  const getTotalPatients = async (req: Request, res: Response) => {
    try {
      const totalPatients = await UserModel.countDocuments({ role: 'patient' });
  
      res.status(200).json({
        message: 'Patients total count',
        data: totalPatients,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
  };

  const getOnlinePatients = async (req: Request, res: Response) => {
    try {
      const onlinePatients = await UserModel.countDocuments({
        role: 'patient',
        lastSeen: { $gte: new Date(Date.now() - 15 * 60 * 1000) },
      });
  
      res.status(200).json({
        message: 'Online Patients count',
        data: onlinePatients,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
  };

  const getTotalMedicalPersonnel = async (req: Request, res: Response) => {
    try {
      const totalMedicalPersonnel = await MedicalPersonnelModel.countDocuments();
  
      res.status(200).json({
        message: 'Medical Personnel total count',
        data: totalMedicalPersonnel,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
  };

  const getTotalMedicalFacilities = async (req: Request, res: Response) => {
    try {
      const totalMedicalFacilities = await MedicalFacilityModel.countDocuments();
  
      res.status(200).json({
        message: 'Medical Facilities total count',
        data: totalMedicalFacilities,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
  };

export { adminDashboard }