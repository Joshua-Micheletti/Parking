import { NextFunction, Request, Response } from 'express';
import { User } from '../../../schema/database';
import {
    body,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import config from 'config';

export const updateUserInputValidation = [
    body('id').isUUID(),
    body('role')
        .optional()
        .isString()
        .isIn(config.get('user.roles') ?? ['admin', 'dbadmin', 'driver']),
    body('base')
        .optional()
        .isString()
        .isIn(config.get('user.bases') ?? ['SEV', 'BCN', 'MAD', 'MLG', 'VLC'])
];

export async function updateUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    try {
        await User.update(
            { role: req.body.role, base: req.body.base },
            { where: { id: req.body.id } }
        );
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json({ message: 'Succesfully updated the user' });
}
