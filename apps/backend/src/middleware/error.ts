import { Request, Response, NextFunction } from "express";
import { Result, ValidationError } from "express-validator";

export default async function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error);

  if (error instanceof Error) {
    let message: any;

    try {
      message = JSON.parse(error.message);
    } catch (parseError) {
      message = error.message;
    }

    res.status(500).json({ message });
  } 
  else if (error instanceof Result) {
    res.status(400).json({ message: "Invalid input", errors: error });
  }
  else {
    res.status(500).json({ message: "An unknown error occurred" });
  }
}
