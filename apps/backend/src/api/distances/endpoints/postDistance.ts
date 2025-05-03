import { NextFunction, Request, Response } from 'express';
import {
    body,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { Distance } from '../../../schema/database';

export const postDistanceInputValidation = [
    body('origin').isString(),
    body('destination').isString(),
    body('distance').isFloat({ min: 0.00000001 }),
    body('fuel_price').isFloat({ min: 0.0000001 })
];

export async function postDistance(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    req.body.id = uuidv4();

    let response;

    try {
        response = await Distance.create(req.body);
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json(response);
}
