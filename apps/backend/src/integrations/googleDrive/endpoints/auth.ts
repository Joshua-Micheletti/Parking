import { NextFunction, Request, RequestHandler, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

export function getAuthEndpoint(client: OAuth2Client): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        const authUrl = client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/drive.file']
        });
        res.redirect(authUrl);
    };
}
