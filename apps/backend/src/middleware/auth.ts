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
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const authToken: string = authHeader.replace('Bearer ', '');

    if (!authToken) {
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
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const payload: IJwtPayload = decoded;

        if (!payload) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        req.user = payload.username;
        req.role = payload.role;

        next();
    });
}
