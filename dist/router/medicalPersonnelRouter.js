"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medicalPersonnelController_1 = require("../controller/medicalPersonnelController");
const authorizationMiddleware_1 = __importDefault(require("../middleware/authorizationMiddleware"));
const medicalPersonnelRouter = express_1.default.Router();
medicalPersonnelRouter.get('/profile', medicalPersonnelController_1.getMedicalPersonnelProfile);
medicalPersonnelRouter.get('/profile/:doctorId', medicalPersonnelController_1.getDoctorProfile);
medicalPersonnelRouter.get('/list/doctor', medicalPersonnelController_1.getDoctorsList);
medicalPersonnelRouter.get('/list/personnel', (0, authorizationMiddleware_1.default)(['staff', 'admin']), medicalPersonnelController_1.getPersonnelsList);
medicalPersonnelRouter.get('/list/admin', (0, authorizationMiddleware_1.default)(['staff', 'admin']), medicalPersonnelController_1.getMedicalAdminList);
medicalPersonnelRouter.put('/update/:personnelId', (0, authorizationMiddleware_1.default)(['medical_admin', 'doctor', 'staff', 'admin']), medicalPersonnelController_1.updatePersonnel);
exports.default = medicalPersonnelRouter;
