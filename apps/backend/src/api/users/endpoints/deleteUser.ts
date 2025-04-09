import { NextFunction, Request, Response } from 'express';
import { User } from '../../../schema/database';
import {
    query,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';

export const deleteUserInputValidation = [query('id').isNumeric()];
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

    let response;

    try {
        response = await User.destroy({
            where: {
                id: req.query.id
            }
        });
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json(response);
}
