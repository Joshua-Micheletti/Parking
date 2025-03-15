import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { IJwtPayload } from '../model/jwt';

export default async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader: string = req.headers.authorization ?? '';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('missing auth header');
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const authToken: string = authHeader.replace('Bearer ', '');

    if (!authToken) {
        console.log('missing auth token');
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const secret: string = config.get('jwt.secret');

    if (!secret) {
        next(new Error('No secret found'));
        return;
    }

    jwt.verify(authToken, secret, (err: any, decoded: any) => {
        if (err) {
            console.log('Error verifying jwt', err);
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const payload: IJwtPayload = decoded;

        if (!payload) {
            console.log('No payload found in the token');
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        req.user = payload.username;
        req.role = payload.role;
        req.base = payload.base;

        next();
    });
}
