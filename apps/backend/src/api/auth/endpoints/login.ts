import { User } from '../../../schema/database';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
    body,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import config from 'config';
import jwt from 'jsonwebtoken';
// import { sign } from 'jsonwebtoken';

export const loginInputValidation = [
    body('username')
        .isString()
        .isLength({
            min: config.get('user.minimumLength') ?? 3,
            max: config.get('user.maximumLength') ?? 20
        }),
    body('password')
        .isString()
        .isLength({
            min: config.get('password.minimumLength') ?? 6,
            max: config.get('password.maximumLength') ?? 20
        })
];

export async function login(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    let response: any;

    const username: string = req.body.username;
    const password: string = req.body.password;

    try {
        response = await User.findOne({
            attributes: ['password', 'role'],
            where: {
                username: username
            }
        });
    } catch (error) {
        next(error);
    }

    if (!response) {
        res.status(404).json({ message: 'Invalid username or password' });
        return;
    }

    bcrypt.compare(password, response.password, function (err, result) {
        if (err) {
            next(err);
            return;
        }

        if (!result) {
            res.status(404).json({ message: 'Invalid username or password' });
            return;
        }

        const options: jwt.SignOptions = {
            expiresIn: '1h'
        };

        const secret: string = config.get('jwt.secret');

        if (!secret) {
            next(new Error('No secret found'));
            return;
        }

        const token = jwt.sign(
            { username: username, role: response.role },
            secret,
            { expiresIn: config.get('jwt.expiresIn') ?? '1h' }
        );

        res.status(200).json({ message: 'Login successful', token: token, role: response.role });
        return;
    });
}
