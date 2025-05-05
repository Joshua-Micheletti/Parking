import {
    DataTypes,
    InitOptions,
    Model,
    ModelAttributes,
    Sequelize
} from 'sequelize';
import config from 'config';

export class CarPool extends Model {}

export async function setupCarPool(
    sequelize: Sequelize,
    force: boolean = false
) {
    const gearboxTypes: string[] = config.get('parking.gearboxTypes');

    const fuelTypes: string[] = config.get('parking.fuelTypes');

    const carPoolFields: ModelAttributes = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
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
    await CarPool.sync({ alter: true, logging: false, force }).catch(
        (error) => {
            console.log('Failed to sync the car pool table');
            console.log(error);
        }
    );
}
