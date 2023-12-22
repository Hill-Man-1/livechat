import express from 'express'
import { getMedicalPersonnelProfile, getDoctorProfile, getDoctorsList, updatePersonnel, getPersonnelsList } from '../controller/medicalPersonnelController';
// import authorMiddleware from '../middleware/authorizationMiddleware';

const medicalPersonnelRouter = express.Router()

medicalPersonnelRouter.get('/profile', getMedicalPersonnelProfile);
medicalPersonnelRouter.get('/profile/:doctorId', getDoctorProfile);
medicalPersonnelRouter.get('/doctor/list', getDoctorsList)
medicalPersonnelRouter.get('/list', getPersonnelsList)
medicalPersonnelRouter.put('/update/:personnelId', updatePersonnel);

export default medicalPersonnelRouter;