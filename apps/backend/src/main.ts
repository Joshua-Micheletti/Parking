import express, { Express } from "express";

import dotenv from "dotenv";
dotenv.config({ path: "./apps/backend/.env" });

import apiServer from "./api/apiServer";

import bodyParser from "body-parser";

import errorHandler from "./middleware/error";

import cors from 'cors';

async function main() {
  const app: Express = express();

  app.use(cors());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/", apiServer());

  app.listen(10000, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Server is running on port 10000");
  });

  app.use(errorHandler);
}

main();
