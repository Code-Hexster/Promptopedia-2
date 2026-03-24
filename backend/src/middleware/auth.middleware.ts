import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';


declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

export const protect = async (request: Request, response: Response, next: NextFunction) => {
    let token;

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = request.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;

            request.user = await User.findById(decoded.id).select('-password') as IUser;

            next();
        } catch (error) {
            console.error(error);
            response.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        response.status(401).json({ message: 'Not authorized, no token' });
    }
};
