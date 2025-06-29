import { NextFunction, Request, Response } from 'express';
import { CarPool } from '../../../schema/database';
import {
    query,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';

export const deleteCarInputValidation = [query('id').isUUID()];
export async function deleteCar(
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
        response = await CarPool.destroy({
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
