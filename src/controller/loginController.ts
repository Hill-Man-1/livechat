import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import JWT_TOKEN from '../config/jwtconfig';
import UserModel from '../models/userModel';
import { errorHandling } from './errorHandling';
import NodeCache from 'node-cache';
import MedicalPersonnelModel from '../models/medicalPersonnelModel';

const failedLoginAttemptsCache = new NodeCache({ stdTTL: 600 });

const loginUser = async (req: Request, res: Response) => {
    try {
        const { usernameOrEmail, password } = req.body;
        let userData = null;
        
        const userEmail = await UserModel.findOne({ email: usernameOrEmail })
        const userUsername = await UserModel.findOne({ username: usernameOrEmail })
        const personnelEmail = await MedicalPersonnelModel.findOne({ email: usernameOrEmail })
        const personnelUsername = await MedicalPersonnelModel.findOne({ username: usernameOrEmail })
        
        if (usernameOrEmail.includes('@')) {
            userData = userEmail || personnelEmail;
        } else {
            userData = userUsername || personnelUsername;
        }

        const failedAttempts = failedLoginAttemptsCache.get<number>(usernameOrEmail);

        if (failedAttempts !== undefined && failedAttempts >= 5) {
            return res.status(400).json(errorHandling(null, 'Too many failed login attempts'));
        }

        if (userData) {
            const passwordCheck = await bcrypt.compare(password, userData.password);

            if (passwordCheck) {
                let refreshToken = req.cookies.refresh_token;

                if (!refreshToken) {
                    refreshToken = jwt.sign({ username: userData.username, id: userData._id, role: userData.role }, JWT_TOKEN as Secret, { expiresIn: '7d' });
                }

                const accessToken = jwt.sign({ username: userData.username, id: userData._id, role: userData.role }, JWT_TOKEN as Secret, { expiresIn: '24h' });

                // Reset limit login
                failedLoginAttemptsCache.del(usernameOrEmail);

                // Expiration time for tokens
                const accessTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
                const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

                // Cookies
                res.cookie('access_token', accessToken, {
                    expires: accessTokenExpiration,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                });

                res.cookie('refresh_token', refreshToken, {
                    expires: refreshTokenExpiration,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                });
                
                userData.password = undefined!;

                return res.status(200).json(errorHandling({
                        message: `${userData.username} Successfully logged in as ${userData.role}`,
                        data: userData,
                        accessToken,
                        accessTokenExpiration,
                        refreshToken,
                        refreshTokenExpiration,
                    }, null)
                );
            } else {
                const newFailedAttempts = (failedAttempts || 0) + 1;
                failedLoginAttemptsCache.set(usernameOrEmail, newFailedAttempts);
                return res.status(400).json(errorHandling(null, 'Incorrect Password or Username/Email'));
            }
        } else {
            return res.status(400).json(errorHandling(null, 'User not found. Please check your credentials.'));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Cannot Connect!! Internal Error!'));
    }
};

const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res.status(200).json(errorHandling("See you next time!", null));
};

export { loginUser, logoutUser };