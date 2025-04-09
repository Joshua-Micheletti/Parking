import { NextFunction, Request, Response } from 'express';
import { User } from '../../../schema/database';
import { Attributes, FindOptions, WhereOptions } from 'sequelize';

export async function getUsers(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    let response;

    // set the default conditions for the query
    const attributes: string[]  = ['id', 'username', 'role'];
    const where: WhereOptions = {base: req.base};

    // if the user is admin, add the base in the query and delete the filter
    if (req.role === 'admin') {
        attributes.push('base');
        delete where.base;
    }

    // create the find options for the query
    const findOptions: FindOptions = {
      attributes,
      where
    }

    // execute the query
    try {
        response = await User.findAll(findOptions);
    } catch (error) {
        next(error);
        return;
    }

    // respond with the results
    res.status(200).json(response);
}
