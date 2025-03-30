import { NextFunction, Request, RequestHandler, Response } from 'express';
import {
    query,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import { OAuth2Client } from 'google-auth-library';
import { API } from '../../../schema/database';

export function getCallbackEndpoint(client: OAuth2Client): RequestHandler[] {
    const callbackInputValidation = [query('code').isString()];

    const callback = async (req: Request, res: Response, next: NextFunction) => {
        const inputErrors: Result<ValidationError> = validationResult(req);

        if (!inputErrors.isEmpty()) {
            next(inputErrors);
            return;
        }

        const code: string = req.query.code as string;

        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);
        console.log("🐛 | callback.ts:25 | callback | tokens:", tokens)

        try {
            await API.create({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                id_token: tokens.id_token,
                token_type: tokens.token_type,
                expire_date: tokens.expiry_date,
                api_type: 'google_drive'
            });
        } catch (error) {
            next(error);
            return;
        }

        res.send('Authentication successful! You can now upload files.');
    };

    return [...callbackInputValidation, callback];
}
