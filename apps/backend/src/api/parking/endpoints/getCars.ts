import { NextFunction, Request, Response } from 'express';
import {
    Parking,
    CarPool,
    Operation,
    sequelize
} from '../../../schema/database';
import { IncludeOptions, WhereOptions } from 'sequelize';
import {
    query,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import { ParkingOperationExtended } from '../../../schema/operation';
import {
    isParkingArray,
    ParkingExtended,
    ParkingType
} from '../../../schema/parking';

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

    // if the user is admin, add the base in the query and delete the filter
    if (req.role === 'admin') {
        delete where.base;
    }

    let response: ParkingType[] | ParkingExtended[];

    if (req.query.full) {
        try {
            response = await Parking.findAllExtended(where);
        } catch (error) {
            next(error);
            return;
        }
    } else {
        try {
            const fullResponse: Parking[] = await Parking.findAll(where);

            response = fullResponse.map((value: Parking) => {
                return value.get() as ParkingType;
            });
        } catch (error) {
            next(error);
            return;
        }
    }

    let operationsResponse: ParkingOperationExtended[];

    try {
        operationsResponse = await Operation.getWithResolvedIDs(sequelize);
    } catch (error) {
        next(error);
        return;
    }

    for (const operation of operationsResponse) {
        if (operation.type === 'create') {
            const data: any = {
                id: operation.data.id,
                car_id: operation.data.car_id,
                status: operation.data.status,
                notes: operation.data.notes,
                enter_date: operation.data.enter_date,
                billing_start_date: operation.data.billing_start_date,
                base: operation.data.base,
                approved: false
            };

            if (isParkingArray(response)) {
                (response as ParkingType[]).push(data as ParkingType);
            } else {
                (response as ParkingExtended[]).push({
                    ...data,
                    license_plate: operation.license_plate,
                    brand: operation.brand,
                    model: operation.model,
                    color: operation.color,
                    provider: operation.provider,
                    gearbox_type: operation.gearbox_type,
                    fuel_type: operation.fuel_type
                } as ParkingExtended);
            }
        }
    }

    res.status(200).json(response);
}
