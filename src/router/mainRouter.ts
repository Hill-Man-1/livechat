import express, { Request, Response } from 'express';
import authenMiddleware from '../middleware/authenticationMiddleware';
import { adminRouter, appointmentRouter, authRouter, medicalFacilityRouter, medicalPersonnelRouter, medicalReportRouter, userRouter } from '../router';

const router = express.Router();

router.get("/", function (req: Request, res: Response) {
    res.status(200).json({
        success: true,
        message: "Hello, this is Medify! Group [e]'s Final Project!"
    })
})

router.use('/api/v1/auth', authRouter)
router.use('/api/v1/admin', authenMiddleware, adminRouter)
router.use('/api/v1/user', authenMiddleware, userRouter)
router.use('/api/v1/medic', authenMiddleware, medicalPersonnelRouter)
router.use('/api/v1/facility', authenMiddleware, medicalFacilityRouter)
router.use('/api/v1/appointment', authenMiddleware, appointmentRouter)
router.use('/api/v1/report', authenMiddleware, medicalReportRouter)

export default router;