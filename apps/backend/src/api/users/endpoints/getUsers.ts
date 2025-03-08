import { Request, Response } from "express";
import { User } from "../../../schema/database";
import { FindOptions } from "sequelize";

export async function getUsers(req: Request, res: Response): Promise<void> {
  let response;

  const findOptions: FindOptions = {
    attributes: ["username"],
  };

  try {
    response = await User.findAll(findOptions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }

  console.log(response);

  res.status(200).json(response);
}
