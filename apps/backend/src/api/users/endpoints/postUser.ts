import { NextFunction, Request, Response } from "express";
import { User } from "../../../schema/database";
import bcrypt from "bcrypt";
import { body } from "express-validator";
import config from "config";

export const postUserInputValidation = [
  body("username")
    .isString()
    .isLength({
      min: config.get("user.minimumLength") ?? 3,
      max: config.get("user.maximumLength") ?? 20,
    }),
  body("password")
    .isString()
    .isLength({
      min: config.get("password.minimumLength") ?? 6,
      max: config.get("password.maximumLength") ?? 20,
    }),
];

export async function postUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let response: any;

  const saltRounds: number = config.get("password.saltRounds") ?? 10;
  const password: string = req.body.password;

  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      next(err);
      return;
    }

    bcrypt.hash(password, salt, async function (err, hash) {
      if (err) {
        next(err);
        return;
      }

      try {
        response = await User.create({
          username: req.body.username,
          password: hash,
        });
      } catch (error) {
        next(error);
        return;
      }

      res.status(200).json(response);
    });
  });
}
