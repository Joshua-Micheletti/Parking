import {
    Sequelize
} from 'sequelize';
import config from 'config';
import { DatabaseConfig } from '../types/config';
import { Operation, setupOperation } from './operation';
import { API, setupAPI } from './API';
import { Parking, setupParking } from './parking';
import { CarPool, setupCarPool } from './carPool';
import { Distance, setupDistance } from './distance';
import { setupUser, User } from './user';
import { Service, setupService } from './service';

const sequelizeConfig: DatabaseConfig = JSON.parse(
    JSON.stringify(config.get('database'))
);

let sequelize: Sequelize;

const force: boolean = false;

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
        setupUser(sequelize, force);

        /* -------------------------------- DISTANCE -------------------------------- */
        setupDistance(sequelize, force);

        /* -------------------------------- Car Pool -------------------------------- */
        setupCarPool(sequelize, force);

        /* --------------------------------- PARKING -------------------------------- */
        setupParking(sequelize, CarPool, force);

        /* ------------------------------- API Tokens ------------------------------- */
        setupAPI(sequelize, force);

        /* -------------------------------- Operation ------------------------------- */
        setupOperation(sequelize, User, force);

        /* --------------------------------- Service -------------------------------- */
        setupService(sequelize, CarPool, User, force);

        CarPool.hasMany(Service, {foreignKey: 'car_id'});
        CarPool.hasOne(Parking, {foreignKey: 'car_id'});
    }
}

export {
    setupDatabase,
    sequelize,
    User,
    Distance,
    CarPool,
    Parking,
    API,
    Operation,
    Service
};
