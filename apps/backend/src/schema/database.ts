import {
    Sequelize,
    Model,
    ModelAttributes,
    DataTypes,
    InitOptions
} from 'sequelize';
import config from 'config';
import { DatabaseConfig } from '../types/config';

const sequelizeConfig: DatabaseConfig = JSON.parse(
    JSON.stringify(config.get('database'))
);

let sequelize;
class User extends Model {}
class Distance extends Model {}
class CarPool extends Model {}
class Parking extends Model {}
class API extends Model {}

async function setupDatabase() {
    if (sequelizeConfig.connect) {
        if (sequelizeConfig.url) {
            sequelize = new Sequelize(
                sequelizeConfig.url,
                sequelizeConfig.options
            );
        } else {
            sequelize = new Sequelize(sequelizeConfig.options);
        }

        /* ---------------------------------- USER ---------------------------------- */
        const roles: string[] = config.get('user.roles');

        const bases: string[] = config.get('user.bases');

        const userFields: ModelAttributes = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
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
        User.sync({ alter: true, logging: false })
            .then(async () => {
                try {
                    await User.create(
                        {
                            id: 2147483647,
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

        /* -------------------------------- DISTANCE -------------------------------- */
        const distanceFields: ModelAttributes = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            origin: {
                type: DataTypes.STRING,
                allowNull: false
            },
            destination: {
                type: DataTypes.STRING,
                allowNull: false
            },
            distance: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            fuel_price: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        };
        const distanceInitOptions: InitOptions = {
            sequelize,
            modelName: 'Distance',
            name: {
                singular: 'distance',
                plural: 'distance'
            },
            tableName: 'distance',
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ['origin', 'destination']
                }
            ]
        };

        Distance.init(distanceFields, distanceInitOptions);
        Distance.sync({ alter: true, logging: false }).catch((error) => {
            console.log('Failed to sync the distance table');
            console.log(error);
        });

        /* -------------------------------- Car Pool -------------------------------- */
        const gearboxTypes: string[] = config.get('parking.gearboxTypes');

        const fuelTypes: string[] = config.get('parking.fuelTypes');

        const carPoolFields: ModelAttributes = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
                // references: {
                //     model: 'parking',
                //     key: 'car_id'
                // }
            },
            license_plate: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            brand: {
                type: DataTypes.STRING
            },
            model: {
                type: DataTypes.STRING
            },
            color: {
                type: DataTypes.STRING
            },
            provider: {
                type: DataTypes.STRING
            },
            gearbox_type: {
                type: DataTypes.ENUM(...gearboxTypes)
            },
            fuel_type: {
                type: DataTypes.ENUM(...fuelTypes)
            }
        };

        const carPoolInitOptions: InitOptions = {
            sequelize,
            modelName: 'CarPool',
            name: {
                singular: 'car_pool',
                plural: 'car_pool'
            },
            tableName: 'car_pool',
            timestamps: false
        };

        CarPool.init(carPoolFields, carPoolInitOptions);
        await CarPool.sync({ alter: true, logging: false }).catch((error) => {
            console.log('Failed to sync the car pool table');
            console.log(error);
        });

        /* --------------------------------- PARKING -------------------------------- */
        const statuses: string[] = config.get('parking.statuses');

        const parkingFields: ModelAttributes = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            car_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'car_pool',
                    key: 'id'
                },
                unique: true
            },
            status: {
                type: DataTypes.ENUM(...statuses),
                allowNull: false
            },
            notes: {
                type: DataTypes.STRING
            },
            enter_date: {
                type: DataTypes.DATE
            },
            billing_start_date: {
                type: DataTypes.DATE
            },
            billing_end_date: {
                type: DataTypes.DATE
            },
            base: {
                type: DataTypes.ENUM(...bases),
                allowNull: false
            }
        };
        const parkingInitOptions: InitOptions = {
            sequelize,
            modelName: 'Parking',
            name: {
                singular: 'parking',
                plural: 'parking'
            },
            tableName: 'parking',
            timestamps: false
        };

        Parking.init(parkingFields, parkingInitOptions);
        Parking.belongsTo(CarPool, { foreignKey: 'car_id' });
        Parking.sync({ alter: true, logging: false }).catch((error) => {
            console.log('Failed to sync the parking table');
            console.log(error);
        });

        /* ------------------------------- API Tokens ------------------------------- */
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
        API.sync({ alter: true, logging: false }).catch((error) => {
            console.log('Failed to sync the api table');
            console.log(error);
        });
    }
}

export { setupDatabase, sequelize, User, Distance, CarPool, Parking, API };
