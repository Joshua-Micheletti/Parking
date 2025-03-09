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
    User.sync({ alter: true });
}

export { sequelize, User };

