import { Request, Response } from 'express';
import MedicalPersonnelModel from '../models/medicalPersonnelModel';
import { errorHandling } from './errorHandling';

const getDoctorProfile = async (req: Request, res: Response) => {
    try {
        const doctorId = req.params.doctorId;
        const doctor = await MedicalPersonnelModel.findById(doctorId).select('-password');

        if (doctor) {
            return res.status(200).json(errorHandling({
                    message: `${doctor.username}'s Profile`,
                    data: doctor
                }, null)
            );
        } else {
            return res.status(404).json(errorHandling(null, 'Doctor/Specialist not found.'));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const getMedicalPersonnelProfile = async (req: Request, res: Response) => {
    try {
        const medicalPersonnelId = req.user?.id;

        if (!medicalPersonnelId) {
            return res.status(403).json(errorHandling(null, 'Forbidden Access'));
        }

        const medicalPersonnel = await MedicalPersonnelModel.findById(medicalPersonnelId).select('-password');

        if (medicalPersonnel) {
            return res.status(200).json(errorHandling({
                    message: `${medicalPersonnel.username}'s Profile`,
                    data: medicalPersonnel
                }, null)
            );
        } else {
            return res.status(404).json(errorHandling(null, 'Medical personnel not found.'));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const getDoctorsList = async (req: Request, res: Response) => {
    try {
        const doctors = await MedicalPersonnelModel.find({ role: 'doctor' }).select('-password');

        return res.status(200).json(errorHandling({
                message: "List of Doctors and Specialists",
                data: doctors
            },  null)
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const getMedicalAdminList = async (req: Request, res: Response) => {
    try {
        const medical_admins = await MedicalPersonnelModel.find({ role: 'medical_admin' }).select('-password');

        return res.status(200).json(errorHandling({
                message: "List of Medical Admins",
                data: medical_admins
            }, null)
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const getPersonnelsList = async (req: Request, res: Response) => {
    try {
        const personnels = await MedicalPersonnelModel.find().select('-password');

        return res.status(200).json(errorHandling({
                message: "List of Medical Personnels",
                data: personnels
            }, null)
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const updatePersonnel = async (req: Request, res: Response) => {
    const personnelId = req.user?.id; 

    try {
        const personnel = await MedicalPersonnelModel.findById(personnelId);

        if (!personnel) {
            return res.status(403).json(errorHandling(null, 'Forbidden Access'));
        }

        const updatedPersonnel = await MedicalPersonnelModel.findByIdAndUpdate(
            personnelId,
            { $set: req.body },
            { new: true }
        );

        return res.status(200).json(errorHandling({
            message: 'Personnel Data successfully Updated',
            data: updatedPersonnel,
        }, null));

    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
}

export { getDoctorProfile, getMedicalPersonnelProfile, getDoctorsList, getMedicalAdminList, getPersonnelsList, updatePersonnel };
