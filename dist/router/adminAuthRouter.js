"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = require("../controller/registerController");
const adminAuthRouter = express_1.default.Router();
adminAuthRouter.post('/registeruser', registerController_1.registerUserByAdmin);
adminAuthRouter.post('/registerpersonnel', registerController_1.registerMedicalPersonnel);
adminAuthRouter.post('/registerfacility', registerController_1.registerMedicalFacility);
exports.default = adminAuthRouter;
