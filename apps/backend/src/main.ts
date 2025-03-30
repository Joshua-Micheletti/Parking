import express, { Express, Router } from 'express';

import dotenv from 'dotenv';
dotenv.config({ path: './apps/backend/.env' });

import apiServer from './api/apiServer';

import bodyParser from 'body-parser';

import errorHandler from './middleware/error';

import cors from 'cors';

import { OAuth2Client } from 'google-auth-library';

const { google } = require('googleapis');

import credentials from './google_credentials2.json';

import { setupGoogleDrive } from './integrations/googleDrive/setup';

async function main() {
    const app: Express = express();

    const googleDriveRouter: Router | undefined = await setupGoogleDrive();

    if (googleDriveRouter) {
        app.use('/drive', googleDriveRouter);
    }

    // Upload file to Google Drive
    // async function uploadToDrive(filePath: string, fileName: string) {
    //     const drive = google.drive({ version: 'v3', auth: oauth2Client });

    //     const fileMetadata = {
    //         name: fileName
    //     };
    //     const media = {
    //         mimeType: 'application/octet-stream', // Adjust mimeType based on the file type
    //         // body: fs.createReadStream(filePath)
    //     };

    //     const file = await drive.files.create({
    //         resource: fileMetadata,
    //         media: media,
    //         fields: 'id'
    //     });

    //     return file.data.id; // File ID on Google Drive
    // }

    // // Serve the authorization URL
    // app.get('/auth', (req, res) => {
    //   const authUrl = getAuthUrl();
    //   res.redirect(authUrl);
    // });

    // // OAuth2 callback to get tokens
    // app.get('/oauth2callback', async (req, res) => {
    //   if (!req.query.code) {
    //     res.status(500).send('error');
    //     return;
    //   }

    //   const code: string = req.query.code as string;

    //   await getTokens(code);
    //   res.send('Authentication successful! You can now upload files.');
    // });

    app.use(cors());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/', apiServer());

    app.listen(10000, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Server is running on port 10000');
    });

    app.use(errorHandler);
}

main();
