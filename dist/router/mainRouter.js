"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticationMiddleware_1 = __importDefault(require("../middleware/authenticationMiddleware"));
const router_1 = require("../router");
const router = express_1.default.Router();
router.get("/", function (req, res) {
    res.status(200).json({
        success: true,
        message: "Hello, this is Medify! Group [e]'s Final Project!"
    });
});
router.use('/api/v1/auth', router_1.authRouter);
router.use('/api/v1/admin', authenticationMiddleware_1.default, router_1.adminRouter);
router.use('/api/v1/user', authenticationMiddleware_1.default, router_1.userRouter);
router.use('/api/v1/medic', authenticationMiddleware_1.default, router_1.medicalPersonnelRouter);
router.use('/api/v1/facility', authenticationMiddleware_1.default, router_1.medicalFacilityRouter);
router.use('/api/v1/appointment', authenticationMiddleware_1.default, router_1.appointmentRouter);
router.use('/api/v1/report', authenticationMiddleware_1.default, router_1.medicalReportRouter);
exports.default = router;
