import { NextFunction, Request, Response } from "express";
import { Distance } from "../../../schema/database";

export async function getDistances(req: Request, res: Response, next: NextFunction): Promise<void> {
    let response: Distance[] | undefined = undefined;

    try {
        response = await Distance.findAll();
    } catch (error) {
        next(error);
        return;
    }

    res.status(200).json(response);
}