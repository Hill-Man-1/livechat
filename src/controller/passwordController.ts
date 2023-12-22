import { Request, Response } from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import NodeCache from 'node-cache';
import UserModel from '../models/userModel';
import { errorHandling } from './errorHandling';
import nodemailer from 'nodemailer';
import 'dotenv/config'

const resetPasswordCache = new NodeCache({ stdTTL: 300 });

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASS,
    },
});

const resetPasswordRequest = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json(errorHandling(null, 'Invalid email format'));
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json(errorHandling(null, 'User not found'));
    }

    const resetKey = Math.random().toString(36).substring(2, 15);
    resetPasswordCache.set(resetKey, email);
    const link = process.env.LINK

    const mailOptions = {
      from: process.env.NODEMAILER_MAIL,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click the following link to reset your password: <a href="${link}/api/v1/auth/resetpassword?token=${resetKey}">Reset Password</a></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Failed to send reset email:', error);
        return res.status(500).json(errorHandling(null, 'Failed to send reset email'));
      }

      console.log('Reset email sent successfully:', info);
      return res.status(200).json(errorHandling(`Password reset request sent to ${email} with ${resetKey}`, null));
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorHandling(null, 'Password reset request failed'));
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const resetKey = req.query.token as string;
    const email = resetPasswordCache.get(resetKey);

    if (!email) {
      return res.status(400).json(errorHandling(null, 'Invalid token'));
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json(errorHandling(null, 'User not found'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    
    await user.save();

    resetPasswordCache.del(resetKey);
    return res.status(200).json(errorHandling('Password reset success', null));

  } catch (error) {
    console.error(error);
    return res.status(500).json(errorHandling(null, 'Password reset failed'));
  }
};

export { resetPasswordRequest, resetPassword };
