import { NextFunction, Request, Response } from 'express';

export async function getRole(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    res.status(200).json({ user: req.user, role: req.role, base: req.base });
    return;
}
