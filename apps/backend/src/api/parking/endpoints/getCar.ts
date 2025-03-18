import { NextFunction, Request, Response } from 'express';
import {
    query,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';

export const getCarInputValidation = [
    query('license_plate').isString().isLength({
        min: 4,
        max: 10
    })
];

export async function getCar(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }
}
