import { OAuth2Client } from 'google-auth-library';

import config from 'config';
import { GoogleDriveConfig } from '../../types/config';
import { Router } from 'express';
import { getAuthEndpoint } from './endpoints/auth';
import { getCallbackEndpoint } from './endpoints/callback';
import { API } from '../../schema/database';

export let oauth2Client: OAuth2Client;

export async function setupGoogleDrive(): Promise<Router | undefined> {
    const clientSecret: string | undefined =
        process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const clientId: string | undefined = process.env.GOOGLE_DRIVE_CLIENT_ID;

    if (clientSecret === undefined || clientId === undefined) {
        console.error('MISSING GOOGLE DRIVE CLIENT ID AND CLIENT SECRET');
        return;
    }

    const googleDriveConfig: GoogleDriveConfig = config.get(
        'api.googleDrive.web'
    );

    oauth2Client = new OAuth2Client(
        clientId,
        clientSecret,
        googleDriveConfig.redirect_uris[0]
    );

    oauth2Client.on('tokens', async (tokens) => {
        try {
            await API.update(
                {
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    expire_date: tokens.expiry_date
                },
                {
                    where: {
                        token_type: 'google_drive'
                    }
                }
            );
        } catch (error) {
            console.error(error);
            return;
        }
    });

    let tokens: API | null;
    try {
        tokens = await API.findByPk('google_drive');
    } catch (error) {
        console.error(error);
        return;
    }

    if (tokens) {
        const values = tokens.get();
        oauth2Client.setCredentials({
            access_token: values.access_token,
            refresh_token: values.refresh_token,
            expiry_date: values.expire_date,
            id_token: values.id_token,
            token_type: values.token_type
        });
    }

    const router: Router = Router();

    router.get('/auth', getAuthEndpoint(oauth2Client));

    router.get('/callback', getCallbackEndpoint(oauth2Client));

    return router;
}
