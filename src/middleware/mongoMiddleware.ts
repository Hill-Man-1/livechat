import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

const uri: string = process.env.URI!;

const mongoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let client: mongoose.Mongoose | null = null;

    try {
        console.log("MongoDB Connection Start..!");
        client = await mongoose.connect(uri), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        if (client.connection.readyState === 1) {
            const db: mongoose.Connection = client.connection;
            req.db = db;

            console.log("MongoDB Connection Succeed..!");
            next();
        } else {
            console.log("MongoDB Connection Failed...");
            next();
        }
    } catch (error) {
        console.log("MongoDB Connection Failed..:", error);
        next(error); 
    }
    res.on('finish', async () => {
        if (client) {
            await client.connection.close();
            console.log("MongoDB Connection Closed..!");
        }
    });
};

export default mongoMiddleware;
