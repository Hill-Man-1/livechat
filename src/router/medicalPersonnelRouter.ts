import express from 'express'
import { getMedicalPersonnelProfile, getDoctorProfile, getDoctorsList, updatePersonnel, getPersonnelsList, getMedicalAdminList } from '../controller/medicalPersonnelController';
import authorMiddleware from '../middleware/authorizationMiddleware';

const medicalPersonnelRouter = express.Router()

medicalPersonnelRouter.get('/profile', getMedicalPersonnelProfile);
medicalPersonnelRouter.get('/profile/:doctorId', getDoctorProfile);

medicalPersonnelRouter.get('/list/doctor', getDoctorsList)
medicalPersonnelRouter.get('/list/personnel', authorMiddleware(['staff','admin']), getPersonnelsList)
medicalPersonnelRouter.get('/list/admin', authorMiddleware(['staff','admin']), getMedicalAdminList)

medicalPersonnelRouter.put('/update/:personnelId', authorMiddleware(['medical_admin','doctor','staff','admin']), updatePersonnel);

export default medicalPersonnelRouter;