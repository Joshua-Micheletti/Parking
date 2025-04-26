import { NextFunction, Request, Response } from "express";
import { CarPool } from "../../../schema/database";

export async function getCars(req: Request, res: Response, next: NextFunction): Promise<void> {
    let response: CarPool[] | undefined = undefined;

    try {
        response = await CarPool.findAll();
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json(response);
}