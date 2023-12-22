"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medicalFacilityController_1 = require("../controller/medicalFacilityController");
const medicalFacilityRouter = express_1.default.Router();
medicalFacilityRouter.get('/profile/:facilityId', medicalFacilityController_1.getMedicalFacilityProfile);
medicalFacilityRouter.get('/list', medicalFacilityController_1.getMedicalFacilitiesList);
exports.default = medicalFacilityRouter;
