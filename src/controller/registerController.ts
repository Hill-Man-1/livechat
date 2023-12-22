import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt'
import validator from 'validator';
import UserModel from '../models/userModel'; 
import MedicalPersonnelModel from '../models/medicalPersonnelModel';
import MedicalFacilityModel from '../models/medicalFacilityModel';
import { errorHandling } from "./errorHandling";

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { first_name, last_name, username, email, password } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json(errorHandling(null, "Invalid email format"));
        }

        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            return res.status(400).json(errorHandling(null, "Username already exists...!!"));
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({ first_name, last_name, username, email, password: passwordHash, role: 'patient' });
        const newUserData = await UserModel.findById(newUser._id).select('-password')

        return res.status(200).json(errorHandling({
            message: 'User successfully registered',
            data: newUserData,
        }, null));
        
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Invalid Register Request..!!'));
    }
};

const registerUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { first_name, last_name, username, email, password, role } = req.body;
        const rolesEnum = ['staff', 'patient'];

        if (!rolesEnum.includes(role)) {
            return res.status(400).json(errorHandling(null, `Invalid role. Allowed roles are: ${rolesEnum.join(', ')}`));
        }

        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            return res.status(400).json(errorHandling(null, "Username already exists...!!"));
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({ first_name, last_name, username, email, password: passwordHash, role });
        const newUserData = await UserModel.findById(newUser._id).select('-password')

        res.status(200).json(errorHandling({
            message: 'User successfully registered by admin',
            data: newUserData,
        }, null ));

    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Invalid Register Request..!!' });
    }
};

const registerMedicalPersonnel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { first_name, last_name, username, email, password, specialization, hospital, role } = req.body;
        const rolesEnum = ['medical_admin', 'doctor'];

        if (!rolesEnum.includes(role)) {
            return res.status(400).json(errorHandling(null, `Invalid role. Allowed roles are: ${rolesEnum.join(', ')}`));
        }

        const existingMedicalPersonnel = await MedicalPersonnelModel.findOne({ username });

        if (existingMedicalPersonnel) {
            return res.status(400).json(errorHandling(null, "Medical personnel with this username already exists...!!"));
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newMedicalPersonnel = await MedicalPersonnelModel.create({ first_name, last_name, username, email, password: passwordHash, specialization, hospital, role });
        const newMedicalPersonnelData = await MedicalPersonnelModel.findById(newMedicalPersonnel._id).select('-password');

        res.status(200).json({
            message: 'Medical personnel successfully registered',
            data: newMedicalPersonnelData,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Invalid Register Request..!!' });
    }
};

const registerMedicalFacility = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, address, contact, location } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json(errorHandling(null, "Invalid email format"));
        }

        const existingFacility = await MedicalFacilityModel.findOne({ name });

        if (existingFacility) {
            return res.status(400).json(errorHandling(null, `Medical facility with the name ${name} already exists...!!`));
        }

        const newFacility = await MedicalFacilityModel.create({ name, email, address, contact, location });
        const newFacilityData = await MedicalFacilityModel.findById(newFacility._id);

        res.status(200).json({
            message: 'Medical facility successfully registered',
            data: newFacilityData,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Invalid Register Request..!!' });
    }
};

export { registerUser, registerUserByAdmin, registerMedicalPersonnel, registerMedicalFacility }
