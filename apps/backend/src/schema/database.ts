import {
    Sequelize,
    Options,
    Model,
    ModelAttributes,
    DataTypes,
    InitOptions
} from 'sequelize';
import config from 'config';

const sequelizeOptions: Options = {
    host: config.get('database.host'),
    port: config.get('database.port'),
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.database'),
    dialect: config.get('database.dialect')
};

export const sequelize = new Sequelize(sequelizeOptions);

const roles: string[] = Array.isArray(config.get('user.roles'))
    ? config.get('user.roles')
    : ['admin', 'dbadmin', 'driver'];

export class User extends Model {}
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
