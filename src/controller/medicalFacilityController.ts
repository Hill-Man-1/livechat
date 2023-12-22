import { Request, Response } from 'express';
import MedicalFacilityModel from '../models/medicalFacilityModel';
import { errorHandling } from './errorHandling';

const getMedicalFacilityProfile = async (req: Request, res: Response) => {
    try {
        const facilityId = req.params.facilityId;
        const medicalFacility = await MedicalFacilityModel.findById(facilityId);

        if (medicalFacility) {
            return res.status(200).json(errorHandling({
                    message: `${medicalFacility.name}'s Profile`,
                    data: medicalFacility,
                }, null)
            );
        } else {
            return res.status(404).json(errorHandling(null, 'Medical facility not found.'));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const getMedicalFacilitiesList = async (req: Request, res: Response) => {
    try {
        const medicalFacilities = await MedicalFacilityModel.find();

        return res.status(200).json(errorHandling({
                message: 'List of Medical Facilities',
                data: medicalFacilities,
            }, null)
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

export { getMedicalFacilityProfile, getMedicalFacilitiesList };
