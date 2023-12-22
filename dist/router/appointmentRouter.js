"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointmentController_1 = require("../controller/appointmentController");
// import authorMiddleware from '../middleware/authorizationMiddleware';
const appointmentRouter = express_1.default.Router();
appointmentRouter.get('/list', appointmentController_1.getAppointmentList);
appointmentRouter.post('/new', appointmentController_1.createAppointment);
appointmentRouter.put('/update/:appointmentId', appointmentController_1.updateAppointment);
appointmentRouter.patch('/cancel/:appointmentId', appointmentController_1.cancelAppointment);
appointmentRouter.patch('/update/:appointmentId', appointmentController_1.updateAppointmentStatus);
exports.default = appointmentRouter;
