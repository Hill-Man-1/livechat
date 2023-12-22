"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedicalFacilitiesList = exports.getMedicalFacilityProfile = void 0;
const medicalFacilityModel_1 = __importDefault(require("../models/medicalFacilityModel"));
const errorHandling_1 = require("./errorHandling");
const getMedicalFacilityProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const facilityId = req.params.facilityId;
        const medicalFacility = yield medicalFacilityModel_1.default.findById(facilityId);
        if (medicalFacility) {
            return res.status(200).json((0, errorHandling_1.errorHandling)({
                message: `${medicalFacility.name}'s Profile`,
                data: medicalFacility,
            }, null));
        }
        else {
            return res.status(404).json((0, errorHandling_1.errorHandling)(null, 'Medical facility not found.'));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getMedicalFacilityProfile = getMedicalFacilityProfile;
const getMedicalFacilitiesList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medicalFacilities = yield medicalFacilityModel_1.default.find();
        return res.status(200).json((0, errorHandling_1.errorHandling)({
            message: 'List of Medical Facilities',
            data: medicalFacilities,
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Internal Server Error.'));
    }
});
exports.getMedicalFacilitiesList = getMedicalFacilitiesList;
