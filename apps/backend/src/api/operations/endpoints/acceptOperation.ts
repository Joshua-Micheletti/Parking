import { NextFunction, Request, Response } from 'express';
import { Operation, Parking, User } from '../../../schema/database';
import { IncludeOptions } from 'sequelize';
import {
    body,
    Result,
    ValidationChain,
    ValidationError,
    validationResult
} from 'express-validator';
import { objectFieldsToSnakeCase } from '../../../utils/stringUtils';

export const acceptOperationInputValidation: ValidationChain[] = [
    body('id').isUUID()
];

export async function acceptOperation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    let operationFindResponse: Operation | null;

    try {
        operationFindResponse = await Operation.findByPk(req.body.id);
    } catch (error) {
        next(error);
        return;
    }

    if (operationFindResponse === null) {
        next(new Error('No operation found'));
        return;
    }

    const operation = operationFindResponse.get();
    console.log('🐛 | acceptOperation.ts:44 | operation:', operation);

    operation.data = objectFieldsToSnakeCase(operation.data);

    let model;

    if (operation.target === 'parking') {
        model = Parking;
    } else {
        next(new Error('Unavailable Target'));
        return;
    }

    try {
        if (operation.type === 'create') {
            await model.create(operation.data);
        } else {
            throw new Error('Unavailable Action');
        }
    } catch (error) {
        next(error);
        return;
    }

    try {
        const updateResponse = await Operation.update(
            { approved: true },
            {
                where: {
                    id: req.body.id
                },
                logging: console.log
            }
        );
        console.log("Type of ID:", typeof req.body.id);
        console.log('🐛 | acceptOperation.ts:77 | req.body.id:', req.body.id);
        console.log(
            '🐛 | acceptOperation.ts:77 | updateResponse:',
            updateResponse
        );
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json(operation);
}
