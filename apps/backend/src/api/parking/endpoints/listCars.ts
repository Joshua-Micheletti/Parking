import { NextFunction, Request, Response } from "express";
import { Parking } from "../../../schema/database";

export async function listCars(req: Request, res: Response, next: NextFunction): Promise<void> {
    let response: Parking[];

    const attributes: string[] = ['']

    try {
        response = await Parking.findAll();
    } catch (error) {
        next(error);
        return;
    }

    console.log(response);

    res.status(200).json()
}