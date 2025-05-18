import { NextFunction, Request, Response } from 'express';
import { Service } from '../../../schema/service';
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
    query('carId').isUUID()
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

    const whereCondition: WhereOptions = {
        car_id: req.query.carId
    };

    let response: Service[];

    try {
        response = await Service.findAll({ where: whereCondition });
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json(response);
}
