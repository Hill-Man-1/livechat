import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import UserModel from '../models/userModel';

const insertAdmin = async (req?: Request | undefined) => {
    try {
        if (!req || !req.db) {
            console.error("Error!! Can't input Admin data: Request or db is undefined");
            return;
        }

        const adminCheck = await UserModel.findOne({ role: 'admin' });

        if (!adminCheck) {
            const adminFirstName = process.env.ADMIN_FIRSTNAME;
            const adminLastName = process.env.ADMIN_LASTNAME;
            const adminUsername = process.env.ADMIN_USERNAME;
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPass = process.env.ADMIN_PASS;
            const hashedPass = await bcrypt.hash(adminPass!, 10);

            const newAdmin = new UserModel({
                first_name: adminFirstName,
                last_name: adminLastName,
                username: adminUsername,
                email: adminEmail,
                password: hashedPass,
                role: 'admin'
            });

            await newAdmin.save();

            console.log("Admin Account successfully created! Welcome!");
        } else {
            console.log("Reminder: Admin already exists", adminCheck);
            return;
        }
    } catch (error) {
        console.error("Error!! Can't input Admin data", error);
    }
}

export default insertAdmin;
