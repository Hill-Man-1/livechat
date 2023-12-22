"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = require("../router");
const router = express_1.default.Router();
router.get("/", function (req, res) {
    res.status(200).json({
        success: true,
        message: "Hello, this is Medify! Group [e]'s Final Project!"
    });
});
router.use('/api/v1/auth', router_1.authRouter);
router.use('/api/v1/admin/auth', router_1.adminAuthRouter);
router.use('/api/v1/user', router_1.userRouter);
router.use('/api/v1/medic', router_1.medicalPersonnelRouter);
router.use('/api/v1/facility', router_1.medicalFacilityRouter);
router.use('/api/v1/appointment', router_1.appointmentRouter);
router.use('/api/v1/chats', router_1.chatRouter);
router.use('/api/v1/messages', router_1.messageRouter);
exports.default = router;
