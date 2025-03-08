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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const authHeader = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : '';
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const authToken = authHeader.replace('Bearer ', '');
        if (!authToken) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const secret = config_1.default.get('jwt.secret');
        if (!secret) {
            next(new Error('No secret found'));
            return;
        }
        jsonwebtoken_1.default.verify(authToken, secret, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const payload = decoded;
            if (!payload) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            req.user = payload.username;
            req.role = payload.role;
            next();
        });
    });
}
