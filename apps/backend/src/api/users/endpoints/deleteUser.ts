import { NextFunction, Request, Response } from 'express';
import { User } from '../../../schema/database';
import { FindOptions } from 'sequelize';
import {
    query,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import config from 'config';

export const deleteUserInputValidation = [
    query('username')
        .isString()
        .isLength({
            min: config.get('user.minimumLength') ?? 3,
            max: config.get('user.maximumLength') ?? 20
        })
];
export async function deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    const username: string = req.query.username as string;

    if (username === req.user) {
        res.status(403).json({message: 'Forbidden'})
        return;
    }

    let response;

    try {
        response = await User.destroy({
            where: {
                username: username
            }
        });
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json(response);
}
