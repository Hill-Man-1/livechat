import express from 'express'
import { getMedicalFacilityProfile, getMedicalFacilitiesList } from '../controller/medicalFacilityController';

const medicalFacilityRouter = express.Router()

medicalFacilityRouter.get('/profile/:facilityId', getMedicalFacilityProfile);
medicalFacilityRouter.get('/list', getMedicalFacilitiesList)

export default medicalFacilityRouter;