"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medicalPersonnelController_1 = require("../controller/medicalPersonnelController");
// import authorMiddleware from '../middleware/authorizationMiddleware';
const medicalPersonnelRouter = express_1.default.Router();
medicalPersonnelRouter.get('/profile', medicalPersonnelController_1.getMedicalPersonnelProfile);
medicalPersonnelRouter.get('/profile/:doctorId', medicalPersonnelController_1.getDoctorProfile);
medicalPersonnelRouter.get('/doctor/list', medicalPersonnelController_1.getDoctorsList);
medicalPersonnelRouter.get('/list', medicalPersonnelController_1.getPersonnelsList);
medicalPersonnelRouter.put('/update/:personnelId', medicalPersonnelController_1.updatePersonnel);
exports.default = medicalPersonnelRouter;
