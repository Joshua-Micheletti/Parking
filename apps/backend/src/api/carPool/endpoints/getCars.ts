import { NextFunction, Request, Response } from 'express';
import { CarPool } from '../../../schema/database';
import {
    query,
    Result,
    ValidationChain,
    ValidationError,
    validationResult
} from 'express-validator';
import { Op } from 'sequelize';
import * as sequelize from 'sequelize';

export const getCarsInputValidation: ValidationChain[] = [
    query('available').isBoolean().optional()
];

export async function getCars(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    let response: CarPool[] | undefined = undefined;

    let where = {};

    if (req.query.available) {
        where = {
            id: {
                [Op.notIn]: sequelize.literal(`(SELECT car_id FROM parking)`)
            }
        };
    }

    try {
        response = await CarPool.findAll({ where });
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json(response);
}
