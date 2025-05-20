import { NextFunction, Request, Response } from 'express';
import { ExtendedService, Service } from '../../../schema/service';
import {
    query,
    Result,
    ValidationChain,
    ValidationError,
    validationResult
} from 'express-validator';
import { objectFieldsToSnakeCase } from '../../../utils/stringUtils';
import { WhereOptions } from 'sequelize';

export const getServicesInputValidation: ValidationChain[] = [
    query('carId').isUUID().optional(),
    query('full').isBoolean().optional()
];

export async function getServices(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    let whereCondition: WhereOptions | undefined = undefined;

    // let conditions = {};

    if (req.query.carId) {
        whereCondition = {
            car_id: req.query.carId
        };
    }

    let response: Service[] | ExtendedService[];

    if (req.query.full) {
        try {
            response = await Service.findAllExtended(whereCondition);
        } catch (error) {
            next(error);
            return;
        }
    } else {
        try {
            response = await Service.findAll({ where: whereCondition });
        } catch (error) {
            next(error);
            return;
        }
    }

    res.status(200).json(response);
}
