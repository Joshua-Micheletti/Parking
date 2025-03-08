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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUserInputValidation = void 0;
exports.postUser = postUser;
const database_1 = require("../../../schema/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const config_1 = __importDefault(require("config"));
exports.postUserInputValidation = [
    (0, express_validator_1.body)("username")
        .isString()
        .isLength({
        min: (_a = config_1.default.get("user.minimumLength")) !== null && _a !== void 0 ? _a : 3,
        max: (_b = config_1.default.get("user.maximumLength")) !== null && _b !== void 0 ? _b : 20,
    }),
    (0, express_validator_1.body)("password")
        .isString()
        .isLength({
        min: (_c = config_1.default.get("password.minimumLength")) !== null && _c !== void 0 ? _c : 6,
        max: (_d = config_1.default.get("password.maximumLength")) !== null && _d !== void 0 ? _d : 20,
    }),
];
function postUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let response;
        const saltRounds = (_a = config_1.default.get("password.saltRounds")) !== null && _a !== void 0 ? _a : 10;
        const password = req.body.password;
        bcrypt_1.default.genSalt(saltRounds, function (err, salt) {
            if (err) {
                next(err);
                return;
            }
            bcrypt_1.default.hash(password, salt, function (err, hash) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        next(err);
                        return;
                    }
                    try {
                        response = yield database_1.User.create({
                            username: req.body.username,
                            password: hash,
                        });
                    }
                    catch (error) {
                        next(error);
                        return;
                    }
                    res.status(200).json(response);
                });
            });
        });
    });
}
