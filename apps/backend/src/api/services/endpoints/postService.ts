import { NextFunction, Request, Response } from 'express';
import { Service } from '../../../schema/service';
import {
    body,
    Result,
    ValidationChain,
    ValidationError,
    validationResult
} from 'express-validator';
import config from 'config';
import { objectFieldsToSnakeCase } from '../../../utils/stringUtils';
import {v4 as uuidv4} from 'uuid';

export const postServiceInputValidation: ValidationChain[] = [
    body('carId').isUUID(),
    body('type').isIn(config.get('service.types')),
    body('assigner').isUUID(),
    body('assignee').isUUID().optional()
];

export async function postService(
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

    values['id'] = uuidv4();

    let response: any;

    try {
        response = await Service.create(values);
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json(response);
}
