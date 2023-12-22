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

const getUsersList = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find().select('-password');

        return res.status(200).json(
            errorHandling({
                message: "User List",
                data: users
            },
            null)
        );;
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
};

const getPatientsList = async (req: Request, res: Response) => {
    try {
      const patients = await UserModel.find({ role: 'patient' }).select('-password');
  
      return res.status(200).json(
        errorHandling({
          message: 'Patients List',
          data: patients,
        },
        null)
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
  };

  const updateUser = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json(errorHandling(null, 'Unauthorized: Please Login First!!'));
    }

    try {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $set: req.body },
            { new: true }
        );

        if (!user) {
            return res.status(404).json(errorHandling(null, 'User not found.'));
        }

        return res.status(200).json(errorHandling({
              message: 'Patient Data successfully updated',
              data: user,
            }, null)
          );

    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Internal Server Error.'));
    }
}

export { getUserProfileByAdmin, getUserProfile, getUsersList, getPatientsList, updateUser };
