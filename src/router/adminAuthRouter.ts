import express from 'express'
import { registerUserByAdmin, registerMedicalPersonnel, registerMedicalFacility } from '../controller/registerController';

const adminAuthRouter = express.Router()

adminAuthRouter.post('/registeruser', registerUserByAdmin);
adminAuthRouter.post('/registerpersonnel', registerMedicalPersonnel);
adminAuthRouter.post('/registerfacility', registerMedicalFacility);

export default adminAuthRouter;