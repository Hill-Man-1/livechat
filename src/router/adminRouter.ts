import express from 'express'
import authorMiddleware from '../middleware/authorizationMiddleware';
import { registerUserByAdmin, registerMedicalPersonnel, registerMedicalFacility } from '../controller/registerController';
import { adminDashboard } from '../controller/adminDashboardController';

const adminRouter = express.Router()

adminRouter.post('/auth/registeruser', authorMiddleware(['admin']), registerUserByAdmin);
adminRouter.post('/auth/registerpersonnel', authorMiddleware(['staff','admin']), registerMedicalPersonnel);
adminRouter.post('/auth/registerfacility', authorMiddleware(['admin']), registerMedicalFacility);

adminRouter.get('/dashboard', authorMiddleware(['staff','admin']), adminDashboard);

export default adminRouter;