import {
    DataTypes,
    InitOptions,
    Model,
    ModelAttributes,
    Sequelize
} from 'sequelize';
import config from 'config';

export type UserType = {
    id: string,
    username: string,
    password: string,
    role: string,
    base: string
}

export class User extends Model {}

export async function setupUser(sequelize: Sequelize, force: boolean = false) {
    const roles: string[] = config.get('user.roles');

    const bases: string[] = config.get('user.bases');

    const userFields: ModelAttributes = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
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
    await User.sync({ alter: true, logging: false, force })
        .then(async () => {
            try {
                await User.create(
                    {
                        id: '00000000-0000-0000-0000-000000000000',
                        username: 'superuser',
                        password:
                            '$2a$10$qL6UvYwsBVIvTtX8zN2Jquk7Mfg0Kx7vhwAdlC0Vtcv1b5vYLcQ3i',
                        role: 'admin',
                        base: 'SEV'
                    },
                    { logging: false }
                );
            } catch (error) {
                console.log('superuser already saved');
            }
        })
        .catch((error) => {
            console.log('Failed to sync the user table');
            console.log(error);
        });
}
