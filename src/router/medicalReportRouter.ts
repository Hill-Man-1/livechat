import express from 'express'
import authorMiddleware from '../middleware/authorizationMiddleware';
import { createMedicalReport, getMedicalReports } from '../controller/medicalReportController';

const medicalReportRouter = express.Router()

medicalReportRouter.post('/create', authorMiddleware(['medical_admin','doctor']), createMedicalReport)
medicalReportRouter.get('/list', getMedicalReports)

export default medicalReportRouter;