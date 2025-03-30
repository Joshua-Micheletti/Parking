import { Options } from 'sequelize';

export type DatabaseConfig = {
    url?: string;
    options: Options;
    connect?: boolean;
};

export type GoogleDriveConfig = {
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    redirect_uris: string[];
};
