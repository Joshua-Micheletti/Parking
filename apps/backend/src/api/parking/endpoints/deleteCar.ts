import { NextFunction, Request, Response } from 'express';
import { CarPool, Parking, sequelize, Service } from '../../../schema/database';
import {
    query,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import { Op } from 'sequelize';

export const deleteCarInputValidation = [query('id').isUUID()];
export async function deleteCar(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    let transaction;

    try {
        transaction = await sequelize.transaction();

        let response;

        response = await Parking.findByPkFull(req.query.id as string, {
            transaction
        });

        console.log('🐛 | deleteCar.ts:35 | response:', response);

        const serviceIds = response.service.map((service) => {
            return service.id;
        });

        response = await Parking.destroy({
            where: { id: req.query.id },
            transaction
        });

        console.log('🐛 | deleteCar.ts:46 | response:', response);

        response = await Service.destroy({
            where: { id: { [Op.in]: serviceIds }, transaction }
        });

        await transaction.commit();

        res.status(200).json(response);
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        next(error);
        return;
    }
}
