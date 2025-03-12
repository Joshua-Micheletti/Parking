import { NextFunction, Request, Response } from "express";
import { User } from "../../../schema/database";
import { FindOptions } from "sequelize";

export async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  let response;

  const findOptions: FindOptions = {
    attributes: ["username", "role", "base"],
  };

  try {
    response = await User.findAll(findOptions);
  } catch (error) {
    next(error);
    return;
  }

  res.status(200).json(response);
}
