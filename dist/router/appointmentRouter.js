"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointmentController_1 = require("../controller/appointmentController");
const authorizationMiddleware_1 = __importDefault(require("../middleware/authorizationMiddleware"));
const appointmentRouter = express_1.default.Router();
appointmentRouter.get('/list', appointmentController_1.getAppointmentList);
appointmentRouter.post('/new', (0, authorizationMiddleware_1.default)(['patient']), appointmentController_1.createAppointment);
appointmentRouter.put('/update/:appointmentId', appointmentController_1.updateAppointment);
appointmentRouter.patch('/cancel/:appointmentId', (0, authorizationMiddleware_1.default)(['patient']), appointmentController_1.cancelAppointment);
appointmentRouter.patch('/update/:appointmentId', (0, authorizationMiddleware_1.default)(['medical_admin', 'staff', 'admin']), appointmentController_1.updateAppointmentStatus);
exports.default = appointmentRouter;
