import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import { errorHandling } from './errorHandling';

const getUserProfileByAdmin = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await UserModel.findById(userId);

        if (user) {
            return res.status(200).json(
                errorHandling({
                    message: `${user.username}'s Profile`,
                    data: user
                },
                null)
            );
        } else {
            return res.status(404).json(errorHandling(null, 'User not found.'));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(403).json(errorHandling(null, 'Access Forbidden.'));
        }

        const user = await UserModel.findById(userId).select('-password');

        if (user) {
            return res.status(200).json({data: user})
        } else {
            return res.status(404).json(errorHandling(null, 'User not found.'));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const getUsersList = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find().select('-password');

        return res.status(200).json({data: users})
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const getUserPatient = async (req: Request, res: Response) => {
    try {
        const patients = await UserModel.find({ role: 'patient' }).select('-password');
        return res.status(200).json({ data: patients }); // Change 'patients' to 'data'
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const updateUser = async (req: Request, res: Response) => {
    const id = req.params.userId

    try {
        const user = await UserModel.findByIdAndUpdate(id, 
            {$set: req.body},
            {new: true}
        );

        res.status(200).json({
            message: 'Data successfully Updated',
            data: user,
        });

    } catch (error) {
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
}


export { getUserProfileByAdmin, getUserProfile, getUsersList, getUserPatient, updateUser };
