import { DataTypes, InitOptions, Model, ModelAttributes, Sequelize } from 'sequelize';
import config from 'config';

export class API extends Model {}

export async function setupAPI(sequelize: Sequelize, force: boolean = false) {
    const apiTypes: string[] = config.get('api.types');

    const APIFields: ModelAttributes = {
        api_type: {
            type: DataTypes.ENUM(...apiTypes),
            primaryKey: true
        },
        access_token: {
            type: DataTypes.STRING
        },
        refresh_token: {
            type: DataTypes.STRING
        },
        id_token: {
            type: DataTypes.STRING
        },
        token_type: {
            type: DataTypes.STRING
        },
        expire_date: {
            type: DataTypes.BIGINT
        }
    };

    const APIInitOptions: InitOptions = {
        sequelize,
        modelName: 'API',
        name: {
            singular: 'api',
            plural: 'api'
        },
        tableName: 'api',
        timestamps: false
    };

    API.init(APIFields, APIInitOptions);
    await API.sync({ alter: true, logging: false, force }).catch((error) => {
        console.log('Failed to sync the api table');
        console.log(error);
    });
}
