import { NextFunction, Request, Response } from 'express';

export default async function admin(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    if (req.role !== 'admin') {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    next();
}
