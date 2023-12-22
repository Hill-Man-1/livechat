import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
// import JWT_TOKEN from '../config/jwtconfig';
import UserModel from '../models/userModel';
import { errorHandling } from './errorHandling';
import NodeCache from 'node-cache';
import MedicalPersonnelModel from '../models/medicalPersonnelModel';

const failedLoginAttemptsCache = new NodeCache({ stdTTL: 600 });

const loginUser = async (req: Request, res: Response) => {
    try {
        const { usernameOrEmail, password } = req.body;
        
        let user = await UserModel.findOne({ $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] });
        if (!user) {
            // Check if the user is a Medical Personnel
            user = await MedicalPersonnelModel.findOne({ $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] });
        }

        if (!usernameOrEmail || !password) {
            return res.status(400).json(errorHandling('Username/Email and Password must be provided.', null));
        }

        // Check for too many failed login attempts
        const failedAttempts = failedLoginAttemptsCache.get<number>(usernameOrEmail) || 0;
        if (failedAttempts >= 5) {
            return res.status(429).json(errorHandling('Too many failed login attempts. Please try again later.', null));
        }

        // If user or personnel not found by email or username
        if (!user) {
            failedLoginAttemptsCache.set(usernameOrEmail, failedAttempts + 1, 600); // Increment failed attempts
            return res.status(404).json(errorHandling('Incorrect Username/Email or Password', null));
        }

        // Check if the password is correct
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            failedLoginAttemptsCache.set(usernameOrEmail, failedAttempts + 1, 600); // Increment failed attempts
            return res.status(401).json(errorHandling('Incorrect Username/Email or Password', null));
        }

        // Reset failed login attempts on success
        failedLoginAttemptsCache.del(usernameOrEmail);

        // Proceed with generating tokens and setting cookies
        const secretToken = process.env.SECRET_TOKEN;
        if (!secretToken) {
            return res.status(500).json(errorHandling(null, 'Server error: missing token secret.'));
        }

        let refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            refreshToken = jwt.sign({ username: user.username, id: user._id, role: user.role }, secretToken, { expiresIn: '7d' });
        }

        const accessToken = jwt.sign({ username: user.username, id: user._id, role: user.role }, secretToken, { expiresIn: '24h' });

        // Expiration time for tokens
        const accessTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Cookies setup
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
        
        // Return user data without password
        return res.status(200).json({_id: user._id, username: user.username, email: user.email, first_name: user.first_name, role: user.role });

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