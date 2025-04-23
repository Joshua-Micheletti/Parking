import { NextFunction, Request, Response } from 'express';
import { Parking } from '../../../schema/database';
import { WhereOptions } from 'sequelize';

export async function getCars(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const where: WhereOptions = { base: req.base };

    // if the user is admin, add the base in the query and delete the filter
    if (req.role === 'admin') {
        delete where.base;
    }

    let response: Parking[];

    try {
        response = await Parking.findAll({ where });
    } catch (error) {
        next(error);
        return;
    }

    console.log('🐛 | getCars.ts:26 | getCars | response:', response);
    res.status(200).json(response);
}
