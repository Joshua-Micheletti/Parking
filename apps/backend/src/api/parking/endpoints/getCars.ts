import { NextFunction, Request, Response } from 'express';
import { Parking, CarPool } from '../../../schema/database';
import { IncludeOptions, WhereOptions } from 'sequelize';
import {
    query,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';

export const getCarsInputValidation = [query('full').isBoolean().optional()];

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

    const where: WhereOptions = { base: req.base };

    let include: IncludeOptions | undefined = undefined;

    if (req.query.full) {
        include = {
            include: [
                {
                    model: CarPool,
                    attributes: [
                        'license_plate',
                        'brand',
                        'model',
                        'color',
                        'provider',
                        'gearbox_type',
                        'fuel_type'
                    ]
                }
            ]
        };
    }

    // if the user is admin, add the base in the query and delete the filter
    if (req.role === 'admin') {
        delete where.base;
    }

    let response: Parking[];

    try {
        response = await Parking.findAll({ where, ...include });
    } catch (error) {
        next(error);
        return;
    }

    if (req.query.full) {
        response = response.map(parking => {
            const plain = parking.get({plain: true});
            return {
                ...plain,
                ...plain.car_pool,
                car_pool: undefined
            }
        });
    }
    res.status(200).json(response);
}
