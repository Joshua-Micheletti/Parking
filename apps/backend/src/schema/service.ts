import {
    DataTypes,
    InitOptions,
    Model,
    ModelAttributes,
    Sequelize
} from 'sequelize';
import config from 'config';

export class Service extends Model {}

export async function setupService(
    sequelize: Sequelize,
    force: boolean = false
) {
    const serviceTypes: string[] = config.get('service.types');

    const serviceFields: ModelAttributes = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        assigner: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        assignee: {
            type: DataTypes.STRING,
            allowNull: false
        },
        car_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(...serviceTypes),
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    };
    const serviceInitOptions: InitOptions = {
        sequelize,
        modelName: 'Service',
        name: {
            singular: 'service',
            plural: 'service'
        },
        tableName: 'service',
        timestamps: false
    };

    Service.init(serviceFields, serviceInitOptions);
    await Service.sync({ alter: true, logging: false, force }).catch(
        (error) => {
            console.log('Failed to sync the service table');
            console.log(error);
        }
    );
}
