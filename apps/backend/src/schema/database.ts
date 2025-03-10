import {
    Sequelize,
    Model,
    ModelAttributes,
    DataTypes,
    InitOptions
} from 'sequelize';
import config from 'config';
import { DatabaseConfig } from '../types/databaseConfig';

const sequelizeConfig: DatabaseConfig = JSON.parse(JSON.stringify(config.get('database')));

let sequelize;
class User extends Model { }

if (sequelizeConfig.connect) {
    if (sequelizeConfig.url) {
        sequelize = new Sequelize(sequelizeConfig.url, sequelizeConfig.options);
    } else {
        sequelize = new Sequelize(sequelizeConfig.options);
    }

    const roles: string[] = Array.isArray(config.get('user.roles'))
        ? config.get('user.roles')
        : ['admin', 'dbadmin', 'driver'];

    const bases: string[] = Array.isArray(config.get('user.bases'))
        ? config.get('user.bases')
        : ['SEV', 'BCN', 'MAD', 'MLG', 'VLC']

    const userFields: ModelAttributes = {
        username: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.ENUM(...roles),
            defaultValue: config.get('user.defaultRole') ?? 'driver',
            allowNull: false
        },
        base: {
            type: DataTypes.ENUM(...bases),
            defaultValue: config.get('user.defaultBase') ?? 'SEV',
            allowNull: false
        }
    };
    const userInitOptions: InitOptions = {
        sequelize,
        modelName: 'User',
        name: {
            singular: 'user',
            plural: 'user'
        },
        tableName: 'user',
        timestamps: false
    };

    User.init(userFields, userInitOptions);
    User.sync({ alter: true }).then(() => {
        User.create({
            username: 'superuser',
            password: '$2a$10$qL6UvYwsBVIvTtX8zN2Jquk7Mfg0Kx7vhwAdlC0Vtcv1b5vYLcQ3i',
            role: 'admin',
            base: 'SEV'
        }).catch((error) => {
            console.log('superuser already saved');
        });
    }).catch((error) => {
        console.log('Failed to sync the user table');
    });
}

export { sequelize, User };

