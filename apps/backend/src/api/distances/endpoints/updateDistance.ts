import { Request, Response, NextFunction } from 'express';
import {
    body,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import { Distance } from '../../../schema/database';

export const updateDistanceInputValidation = [
    body('id').isNumeric(),
    body('origin').isString(),
    body('destination').isString(),
    body('distance').isFloat({ min: 0.00000001 }),
    body('fuel_price').isFloat({ min: 0.0000001 })
];

export async function updateDistance(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    const where = {
        id: req.body.id
    };

    const values = {
        origin: req.body.origin,
        destination: req.body.destination,
        distance: req.body.distance,
        fuel_price: req.body.fuel_price
    };

    let response;

    try {
        response = await Distance.update(values, { where: where });
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json(response);
}
