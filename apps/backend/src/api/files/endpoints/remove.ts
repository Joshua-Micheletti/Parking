import { Request, Response, NextFunction } from 'express';
import {
    query,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import { drive_v3, google } from 'googleapis';
import { oauth2Client } from '../../../integrations/googleDrive/setup';

export const removeInputValidation = [query('id').isString()];

export async function remove(req: Request, res: Response, next: NextFunction) {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }
    
    const id: string = req.query.id as string;
    
    const drive: drive_v3.Drive = google.drive({
        version: 'v3',
        auth: oauth2Client
    });

    let response;
    
    try {
        response = await drive.files.delete({fileId: id});
    } catch (error) {
        next(error);
        return;
    }
    
    console.log("🐛 | delete.ts:18 | remove | response:", response)
    
    res.status(200).json({message: 'Succesfully deleted file'});
}
