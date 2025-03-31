import { NextFunction, Request, Response } from 'express';
import {
    query,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import { drive_v3, google } from 'googleapis';
import { oauth2Client } from '../../../integrations/googleDrive/setup';
import { Readable } from 'stream';

export const downloadInputValidation = [query('id').isString()];

export async function download(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    const drive: drive_v3.Drive = google.drive({
        version: 'v3',
        auth: oauth2Client
    });

    let response;

    try {
        response = await drive.files.get({fileId: req.query.id as string, alt: 'media'}, {responseType: 'stream'});
    } catch (error) {
        next(error);
        return;
    }

    response.data.pipe(res);
}
