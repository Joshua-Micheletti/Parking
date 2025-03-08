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
exports.loginInputValidation = void 0;
exports.login = login;
const database_1 = require("../../../schema/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { sign } from 'jsonwebtoken';
exports.loginInputValidation = [
    (0, express_validator_1.body)('username')
        .isString()
        .isLength({
        min: (_a = config_1.default.get('user.minimumLength')) !== null && _a !== void 0 ? _a : 3,
        max: (_b = config_1.default.get('user.maximumLength')) !== null && _b !== void 0 ? _b : 20
    }),
    (0, express_validator_1.body)('password')
        .isString()
        .isLength({
        min: (_c = config_1.default.get('password.minimumLength')) !== null && _c !== void 0 ? _c : 6,
        max: (_d = config_1.default.get('password.maximumLength')) !== null && _d !== void 0 ? _d : 20
    })
];
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const inputErrors = (0, express_validator_1.validationResult)(req);
        if (!inputErrors.isEmpty()) {
            next(inputErrors);
            return;
        }
        let response;
        const username = req.body.username;
        const password = req.body.password;
        try {
            response = yield database_1.User.findOne({
                attributes: ['password', 'role'],
                where: {
                    username: username
                }
            });
        }
        catch (error) {
            next(error);
        }
        if (!response) {
            res.status(404).json({ message: 'Invalid username or password' });
            return;
        }
        bcrypt_1.default.compare(password, response.password, function (err, result) {
            var _a;
            if (err) {
                next(err);
                return;
            }
            if (!result) {
                res.status(404).json({ message: 'Invalid username or password' });
                return;
            }
            const options = {
                expiresIn: '1h'
            };
            const secret = config_1.default.get('jwt.secret');
            if (!secret) {
                next(new Error('No secret found'));
                return;
            }
            const token = jsonwebtoken_1.default.sign({ username: username, role: response.role }, secret, { expiresIn: (_a = config_1.default.get('jwt.expiresIn')) !== null && _a !== void 0 ? _a : '1h' });
            res.status(200).json({ message: 'Login successful', token: token, role: response.role });
            return;
        });
    });
}
