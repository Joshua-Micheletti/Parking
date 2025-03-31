import { Request, Response, NextFunction } from 'express';
import {
    check,
    Result,
    ValidationError,
    validationResult
} from 'express-validator';
import { google, drive_v3 } from 'googleapis';
import { oauth2Client } from '../../../integrations/googleDrive/setup';
import { Readable } from 'stream';
import sharp from 'sharp';

export const uploadInputValidation = [
    check('file')
        .custom((_, { req }) => {
            if (!req.file) {
                return false;
            }

            const file: Express.Multer.File = req.file;

            const supportedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

            if (!supportedTypes.includes(file.mimetype)) {
                return false;
            }

            return true;
        })
        .withMessage('Missing or invalid file')
];

export async function upload(req: Request, res: Response, next: NextFunction) {
    const inputErrors: Result<ValidationError> = validationResult(req);

    if (!inputErrors.isEmpty()) {
        next(inputErrors);
        return;
    }

    if (!req.file) {
        return;
    }

    const drive: drive_v3.Drive = google.drive({
        version: 'v3',
        auth: oauth2Client
    });

    const fileMetadata = {
        name: req.file?.originalname,
        parents: ['1PTo3D8qZFZjqce3dxe6du-TDAjQSk9A-']
    };

    let compressedImage: Buffer;
    try {
        compressedImage = await sharp(req.file.buffer)
            .jpeg({ quality: 50 })
            .toBuffer();
    } catch (error) {
        next(error);
        return;
    }

    const stream = Readable.from(compressedImage);

    const media = {
        mimeType: 'application/octet-stream', // Adjust mimeType based on the file type
        body: stream
    };

    let file;

    try {
      file = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: 'id'
      });
    } catch (error) {
      next(error);
      return;
    }

    res.status(200).json({
        message: 'Image uploaded succesfully',
        id: file.data.id
    });
}
