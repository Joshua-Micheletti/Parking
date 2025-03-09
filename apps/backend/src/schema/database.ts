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

let sequelize;
class User extends Model { }


if (config.get('database.connect')) {
    // sequelize = new Sequelize(sequelizeOptions);
    sequelize = new Sequelize("postgresql://neondb_owner:npg_y1jXWr0eINvC@ep-mute-block-a9db7f0g-pooler.gwc.azure.neon.tech/neondb?sslmode=require", {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true
            }
        }
    });

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

