"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorizationMiddleware_1 = __importDefault(require("../middleware/authorizationMiddleware"));
const registerController_1 = require("../controller/registerController");
const adminDashboardController_1 = require("../controller/adminDashboardController");
const adminRouter = express_1.default.Router();
adminRouter.post('/auth/registeruser', (0, authorizationMiddleware_1.default)(['admin']), registerController_1.registerUserByAdmin);
adminRouter.post('/auth/registerpersonnel', (0, authorizationMiddleware_1.default)(['staff', 'admin']), registerController_1.registerMedicalPersonnel);
adminRouter.post('/auth/registerfacility', (0, authorizationMiddleware_1.default)(['admin']), registerController_1.registerMedicalFacility);
adminRouter.get('/dashboard', (0, authorizationMiddleware_1.default)(['staff', 'admin']), adminDashboardController_1.adminDashboard);
exports.default = adminRouter;
