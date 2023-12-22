import express, { Request, Response } from 'express';
import authenMiddleware from '../middleware/authenticationMiddleware';
import { adminAuthRouter, appointmentRouter, authRouter, medicalFacilityRouter, medicalPersonnelRouter, userRouter, chatRouter, messageRouter } from '../router';

const router = express.Router();

router.get("/", function (req: Request, res: Response) {
    res.status(200).json({
        success: true,
        message: "Hello, this is Medify! Group [e]'s Final Project!"
    })
})

router.use('/api/v1/auth', authRouter)
router.use('/api/v1/admin/auth', adminAuthRouter)
router.use('/api/v1/user', userRouter)
router.use('/api/v1/medic', medicalPersonnelRouter)
router.use('/api/v1/facility', medicalFacilityRouter)
router.use('/api/v1/appointment', appointmentRouter)
router.use('/api/v1/chats', chatRouter);
router.use('/api/v1/messages', messageRouter);

export default router;