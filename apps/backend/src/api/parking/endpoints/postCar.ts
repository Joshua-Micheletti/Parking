import { NextFunction, Request, Response } from 'express';
import {
    body,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import config from 'config';
import { Parking } from '../../../schema/database';
import { objectFieldsToSnakeCase } from '../../../utils/stringUtils';

const postCarInputValidation = [
    body('licensePlate').isString().isLength({ min: 4, max: 10 }),
    body('brand').isString().optional(),
    body('model').isString().optional(),
    body('color').isString().optional(),
    body('provider').isString(),
    body('gearboxType').isIn(config.get('parking.gearboxTypes')).optional(),
    body('fuelType').isIn(config.get('parking.fuelTypes')),
    body('status').isIn(config.get('parking.statuses')),
    body('notes').isString().optional(),
    body('enterDate').isDate().optional(),
    body('billingStartDate').isDate().optional(),
    body('billingEndDate').isDate().optional()
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
        const response = await Parking.create(values);

        console.log(response);
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json({message: 'Succesfully added car'});
}


