import {
    DataTypes,
    InitOptions,
    Model,
    ModelAttributes,
    Sequelize
} from 'sequelize';

export class Distance extends Model {}

export async function setupDistance(
    sequelize: Sequelize,
    force: boolean = false
) {
    const distanceFields: ModelAttributes = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
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
    await Distance.sync({ alter: true, logging: false, force }).catch(
        (error) => {
            console.log('Failed to sync the distance table');
            console.log(error);
        }
    );
}
