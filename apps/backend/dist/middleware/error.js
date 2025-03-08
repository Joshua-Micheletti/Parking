"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const express_validator_1 = require("express-validator");
function errorHandler(error, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else if (error instanceof express_validator_1.Result) {
            res.status(400).json({ message: "Invalid input", errors: error });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    });
}
