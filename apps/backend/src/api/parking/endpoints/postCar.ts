import { NextFunction, Request, Response } from 'express';
import {
    body,
    Result,
    ValidationChain,
    ValidationError,
    validationResult
} from 'express-validator';
import config from 'config';
import { Parking } from '../../../schema/database';
import { objectFieldsToSnakeCase } from '../../../utils/stringUtils';

export const postCarInputValidation: ValidationChain[] = [
    body('carId').isNumeric(),
    body('status').isIn(config.get('parking.statuses')),
    body('notes').isString().optional(),
    body('enterDate').isISO8601().optional(),
    body('billingStartDate').isISO8601().optional(),
    body('billingEndDate').isISO8601().optional()
];

export async function postCar(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    const values = objectFieldsToSnakeCase(req.body);

    try {
        await Parking.create(values);
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json({message: 'Succesfully added car'});
}


