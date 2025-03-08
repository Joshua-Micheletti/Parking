import { NextFunction, Request, Response } from 'express';
import {
    body,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import config from 'config';
import { User } from '../../../../schema/database';

export const setRoleInputValidation = [
    body('role')
        .isString()
        .isIn(config.get('user.roles') ?? ['admin', 'dbadmin', 'driver']),
    body('username')
        .isString()
        .isLength({
            min: config.get('user.minimumLength') ?? 3,
            max: config.get('user.maximumLength') ?? 20
        })
];

export async function setRole(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    if (req.role !== 'admin') {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }

    let response: any;

    try {
        response = await User.update(
            {
                role: req.body.role
            },
            {
                where: {
                    username: req.body.username
                }
            }
        );
    } catch (error) {
        next(error);
        return;
    }

    if (response[0] === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    res.status(200).json({ message: 'Role updated' });
    return;
}
