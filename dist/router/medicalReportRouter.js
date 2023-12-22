"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorizationMiddleware_1 = __importDefault(require("../middleware/authorizationMiddleware"));
const medicalReportController_1 = require("../controller/medicalReportController");
const medicalReportRouter = express_1.default.Router();
medicalReportRouter.post('/create', (0, authorizationMiddleware_1.default)(['medical_admin', 'doctor']), medicalReportController_1.createMedicalReport);
medicalReportRouter.get('/list', medicalReportController_1.getMedicalReports);
exports.default = medicalReportRouter;
