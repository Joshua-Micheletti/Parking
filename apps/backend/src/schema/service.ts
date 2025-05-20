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
import { User, UserType } from './user';
import { CarPool, CarType } from './carPool';

export type ServiceType = {
    id: string;
    car_id: string;
    assigner: string;
    assignee: string;
    date: string;
    type: string;
};

export type ExtendedService = {
    id: string;
    car_id: CarType;
    assigner: UserType;
    assignee: UserType;
    date: string;
    type: string;
};

export class Service extends Model {
    static async findAllExtended(
            where?: WhereOptions
        ): Promise<ExtendedService[]> {
            const includeCarPool: IncludeOptions = {
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

            const includeAssignerUser: IncludeOptions = {
                model: User,
                attributes: [
                    'username',
                    'role',
                    'base'
                ],
                as: 'Assigner'
            }

            const includeAssigneeUser: IncludeOptions = {
                model: User,
                attributes: [
                    'username',
                    'role',
                    'base'
                ],
                as: 'Assignee'
            }
    
            const response: Service[] = await this.findAll({ where, include: [includeCarPool, includeAssignerUser, includeAssigneeUser] });
    
            const formattedResponse: ExtendedService[] = response.map(
                (service: Service) => {
                    const plain = service.get({ plain: true });
                    return {
                        ...plain,
                        car_id: {...plain.car_pool},
                        assigner: {...plain.Assigner},
                        assignee: {...plain.Assignee},
                        car_pool: undefined,
                        Assigner: undefined,
                        Assignee: undefined
                    };
                }
            );
    
            return formattedResponse;
        }
}

export async function setupService(
    sequelize: Sequelize,
    CarPool: any,
    User: any,
    force: boolean = false
) {
    const serviceTypes: string[] = config.get('service.types');

    const serviceFields: ModelAttributes = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        assigner: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        assignee: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        car_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'car_pool',
                key: 'id'
            }
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
    Service.belongsTo(CarPool, { foreignKey: 'car_id' });
    Service.belongsTo(User, {as: 'Assigner', foreignKey: 'assigner' });
    Service.belongsTo(User, {as: 'Assignee', foreignKey: 'assignee' });
    await Service.sync({ alter: true, logging: false, force: true }).catch(
        (error) => {
            console.log('Failed to sync the service table');
            console.log(error);
        }
    );
}
