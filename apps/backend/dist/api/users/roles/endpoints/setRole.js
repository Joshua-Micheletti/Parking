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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRoleInputValidation = void 0;
exports.setRole = setRole;
const express_validator_1 = require("express-validator");
const config_1 = __importDefault(require("config"));
const database_1 = require("../../../../schema/database");
exports.setRoleInputValidation = [
    (0, express_validator_1.body)('role')
        .isString()
        .isIn((_a = config_1.default.get('user.roles')) !== null && _a !== void 0 ? _a : ['admin', 'dbadmin', 'driver']),
    (0, express_validator_1.body)('username')
        .isString()
        .isLength({
        min: (_b = config_1.default.get('user.minimumLength')) !== null && _b !== void 0 ? _b : 3,
        max: (_c = config_1.default.get('user.maximumLength')) !== null && _c !== void 0 ? _c : 20
    })
];
function setRole(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const inputErrors = (0, express_validator_1.validationResult)(req);
        if (!inputErrors.isEmpty()) {
            next(inputErrors);
            return;
        }
        if (req.role !== 'admin') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        let response;
        try {
            response = yield database_1.User.update({
                role: req.body.role
            }, {
                where: {
                    username: req.body.username
                }
            });
        }
        catch (error) {
            next(error);
            return;
        }
        if (response[0] === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'Role updated' });
        return;
    });
}
