import { Request, Response, NextFunction } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { google } from 'googleapis';
import { oauth2Client } from '../../../integrations/googleDrive/setup';
import { Readable } from 'stream';

export const uploadInputValidation = [];

export async function upload(req: Request, res: Response, next: NextFunction) {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    req.file;
    console.log('🐛 | upload.ts:15 | upload | req.file:', req.file);

    req.file?.buffer.toString();
    console.log(
        '🐛 | upload.ts:19 | upload | req.file?.buffer.toString():',
        req.file?.buffer.toString()
    );

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
    const fileMetadata = {
      name: req.file?.originalname,
    };

    if (!req.file) {
        return;
    }

    const stream = Readable.from(req.file.buffer);

    const media = {
      mimeType: 'application/octet-stream', // Adjust mimeType based on the file type
      body: stream
    };
  
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });
    console.log("🐛 | upload.ts:48 | upload | file:", file)
  
//     return file.data.id; // File ID on Google Drive
//   }

    res.status(200).send('OK');
}
