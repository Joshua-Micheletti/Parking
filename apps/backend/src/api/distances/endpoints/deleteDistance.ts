import { Request, Response, NextFunction } from 'express';
import {
    query,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import { Distance } from '../../../schema/database';

export const updateDistanceInputValidation = [query('id').isNumeric()];

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
        id: req.query.id
    };

    let response;

    try {
        response = await Distance.destroy({ where: where });
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json(response);
}
