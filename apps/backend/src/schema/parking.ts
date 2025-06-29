import {
    DataTypes,
    IncludeOptions,
    InitOptions,
    Model,
    ModelAttributes,
    Sequelize,
    WhereOptions
} from 'sequelize';
import config from 'config';
import { CarPool, Service } from './database';

export type ParkingType = {
    car_id: string;
    status: string;
    notes: string;
    base: string;
    enter_date: string;
    billing_start_date: string;
    billing_end_date: string;
    id: string;
    accepted?: boolean;
};

export type ParkingExtended = {
    car_id: string;
    status: string;
    notes: string;
    base: string;
    enter_date: string;
    billing_start_date: string;
    billing_end_date: string;
    id: string;
    license_plate: string;
    brand: string;
    model: string;
    color: string;
    provider: string;
    gearbox_type: string;
    fuel_type: string;
    accepted?: boolean;
};

export type ParkingFull = {
    car_id: string;
    status: string;
    notes: string;
    base: string;
    enter_date: string;
    billing_start_date: string;
    billing_end_date: string;
    id: string;
    license_plate: string;
    brand: string;
    model: string;
    color: string;
    provider: string;
    gearbox_type: string;
    fuel_type: string;
    accepted?: boolean;
    service: {
        assignee: string;
        assigner: string;
        id: string;
        type: string;
        date: string;
    }[];
};

export function isParking(obj: any): obj is ParkingType {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'string' &&
        typeof obj.car_id === 'string' &&
        typeof obj.status === 'string' &&
        typeof obj.notes === 'string' &&
        typeof obj.enter_date === 'string' &&
        typeof obj.billing_start_date === 'string' &&
        typeof obj.base === 'string'
    );
}

export function isParkingArray(arr: any): arr is ParkingType[] {
    return Array.isArray(arr) && arr.every(isParking);
}

export class Parking extends Model {
    static async findAllExtended(
        where: WhereOptions
    ): Promise<ParkingExtended[]> {
        const include: IncludeOptions = {
            model: CarPool,
            attributes: [
                'license_plate',
                'brand',
                'model',
                'color',
                'provider',
                'gearbox_type',
                'fuel_type'
            ]
        };

        const response: Parking[] = await this.findAll({
            where,
            include: [include]
        });

        const formattedResponse: ParkingExtended[] = response.map(
            (parking: Parking) => {
                const plain = parking.get({ plain: true });
                return {
                    ...plain,
                    ...plain.car_pool,
                    car_pool: undefined
                };
            }
        );

        return formattedResponse;
    }

    static async findByPkFull(id: string, options: any): Promise<ParkingFull> {
        const response = await Parking.findByPk(id, {
            ...options,
            include: [
                {
                    model: CarPool,
                    attributes: [
                        'license_plate',
                        'brand',
                        'model',
                        'color',
                        'provider',
                        'gearbox_type',
                        'fuel_type'
                    ],
                    include: [
                        {
                            model: Service,
                            attributes: ['id', 'assigner', 'assignee', 'type', 'date']
                        }
                    ]
                }
            ]
        });

        const plain = response?.get({ plain: true });

        return { ...plain, ...plain.car_pool, car_pool: undefined };
    }
}

export async function setupParking(
    sequelize: Sequelize,
    CarPool: any,
    force: boolean = false
) {
    const statuses: string[] = config.get('parking.statuses');
    const bases: string[] = config.get('user.bases');

    const parkingFields: ModelAttributes = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        car_id: {
            type: DataTypes.UUID,
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
    await Parking.sync({ alter: true, logging: false, force }).catch(
        (error) => {
            console.log('Failed to sync the parking table');
            console.log(error);
        }
    );
}
