import { NextFunction, Request, Response } from 'express';
import { Operation, User } from '../../../schema/database';
import { IncludeOptions } from 'sequelize';
import {
    query,
    Result,
    ValidationChain,
    ValidationError,
    validationResult
} from 'express-validator';

export const getOperationsInputValidation: ValidationChain[] = [
    query('full').isBoolean()
];

export async function getOperations(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    let include: IncludeOptions | undefined = undefined;

    if (req.query.full) {
        include = {
            include: [
                {
                    model: User,
                    attributes: ['username', 'base']
                }
            ]
        };
    }

    let response: Operation[];

    try {
        response = await Operation.findAll({ ...include });
    } catch (error) {
        next(error);
        return;
    }

    if (req.query.full) {
        response = response.map((operation: Operation) => {
            const plain = operation.get({ plain: true });
            return {
                ...plain,
                ...plain.user,
                user: undefined
            };
        });
    }

    res.status(200).json(response);
}
