import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt'
import validator from 'validator';
import UserModel from '../models/userModel'; 
import MedicalPersonnelModel from '../models/medicalPersonnelModel';
import MedicalFacilityModel from '../models/medicalFacilityModel';
import { errorHandling } from "./errorHandling";

const registerUser = async (req:Request, res:Response) => {
    try {
    const { first_name, last_name, username, email, password, confirmpassword } = req.body;
    
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
        return res.status(400).json({ message: 'Email already registered' });
    }
    
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
        return res.status(400).json({ message: 'Username already registered' });
    }

    if (!first_name || !last_name || !username || !email || !password || !confirmpassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Email is not valid' });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: 'Password must be a strong password' });
    }

    if (!validator.equals(password, confirmpassword)) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({ first_name, last_name, username, email, password: passwordHash, role: 'patient' });

        res.status(200).json({
            message: 'User successfully registered',
            data: newUser._id,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Invalid Register Request..!!' });
    }
};

const registerUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { first_name, last_name, username, email, password, confirmpassword, role } = req.body;
        const rolesEnum = ['staff', 'patient'];

        if (!rolesEnum.includes(role)) {
            return res.status(400).json(errorHandling(null, `Invalid role. Allowed roles are: ${rolesEnum.join(', ')}`));
        }

        const existingUser = await UserModel.findOne({ username });

        if (!first_name || !last_name || !username || !email || !password || !confirmpassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (existingUser) {
            return res.status(400).json(errorHandling(null, "Username already exists...!!"));
        }

        if (!validator.equals(password, confirmpassword)) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({ first_name, last_name, username, email, password: passwordHash, role });

        res.status(200).json({
            message: 'User successfully registered by admin',
            data: newUser._id,
        });

    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Invalid Register Request..!!' });
    }
};

const registerMedicalPersonnel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { first_name, last_name, username, email, password, confirmpassword, specialization, hospital, role } = req.body;
        const rolesEnum = ['medical_admin', 'doctor'];

        if (!rolesEnum.includes(role)) {
            return res.status(400).json(errorHandling(null, `Invalid role. Allowed roles are: ${rolesEnum.join(', ')}`));
        }

        const existingMedicalPersonnel = await MedicalPersonnelModel.findOne({ username });

        if (!first_name || !last_name || !username || !email || !password || !confirmpassword || !specialization || !hospital || !role){
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (existingMedicalPersonnel) {
            return res.status(400).json(errorHandling(null, "Medical personnel with this username already exists...!!"));
        }

        if (!validator.equals(password, confirmpassword)) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newMedicalPersonnel = await MedicalPersonnelModel.create({ first_name, last_name, username, email, password: passwordHash, specialization, hospital, role });

        res.status(200).json({
            message: 'Medical personnel successfully registered',
            data: newMedicalPersonnel._id,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Invalid Register Request..!!', message: 'Failed to register medical personnel.' });
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

        res.status(200).json({
            message: 'Medical facility successfully registered',
            data: newFacility._id,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Invalid Register Request..!!' });
    }
};

export { registerUser, registerUserByAdmin, registerMedicalPersonnel, registerMedicalFacility }
