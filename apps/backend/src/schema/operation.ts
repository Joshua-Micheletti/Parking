import {
    DataTypes,
    InitOptions,
    Model,
    ModelAttributes,
    QueryTypes,
    Sequelize
} from 'sequelize';
import config from 'config';

export type ParkingOperationExtended = {
    type: string;
    data: {
        car_id: string;
        status: string;
        notes: string;
        base: string;
        enter_date: string;
        billing_start_date: string;
        id: string;
    };
    license_plate: string;
    brand: string;
    model: string;
    color: string;
    provider: string;
    gearbox_type: string;
    fuel_type: string;
};

export class Operation extends Model {
    static async getWithResolvedIDs(sequelize: Sequelize): Promise<ParkingOperationExtended[]> {
        const results = await sequelize.query<ParkingOperationExtended>(
            `
            SELECT 
              a.data,
              a.type,
              b.license_plate,
              b.brand,
              b.model,
              b.color,
              b.provider,
              b.gearbox_type,
              b.fuel_type
            FROM 
              "operation" a
            JOIN 
              "car_pool" b
              ON (a.data->>'car_id')::uuid = b.id
            WHERE a.approved = false
          `,
            {
                type: QueryTypes.SELECT
            }
        );

        return results;
    }
}

export async function setupOperation(
    sequelize: Sequelize,
    userModel: any,
    force: boolean = false
) {
    const operationTypes: string[] = config.get('operation.types');

    const operationFields: ModelAttributes = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        type: {
            type: DataTypes.ENUM(...operationTypes),
            allowNull: false
        },
        data: {
            type: DataTypes.JSON
        },
        target: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATE
        },
        approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    };

    const operationInitOptions: InitOptions = {
        sequelize,
        modelName: 'Operation',
        name: {
            singular: 'operation',
            plural: 'operation'
        },
        tableName: 'operation',
        timestamps: false
    };

    Operation.init(operationFields, operationInitOptions);
    Operation.belongsTo(userModel, { foreignKey: 'user_id' });
    await Operation.sync({ alter: true, logging: false, force }).catch(
        (error) => {
            console.log('Failed to sync the operation table');
            console.log(error);
        }
    );
}
