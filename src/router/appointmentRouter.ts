import express from 'express'
import { createAppointment, updateAppointment, getAppointmentList, cancelAppointment, updateAppointmentStatus } from '../controller/appointmentController'
// import authorMiddleware from '../middleware/authorizationMiddleware';
const appointmentRouter = express.Router()

appointmentRouter.get('/list', getAppointmentList)
appointmentRouter.post('/new', createAppointment);
appointmentRouter.put('/update/:appointmentId', updateAppointment);
appointmentRouter.patch('/cancel/:appointmentId', cancelAppointment);
appointmentRouter.patch('/update/:appointmentId', updateAppointmentStatus);

export default appointmentRouter;