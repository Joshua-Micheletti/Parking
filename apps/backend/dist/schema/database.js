"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("config"));
const sequelizeOptions = {
    host: config_1.default.get('database.host'),
    port: config_1.default.get('database.port'),
    username: config_1.default.get('database.username'),
    password: config_1.default.get('database.password'),
    database: config_1.default.get('database.database'),
    dialect: config_1.default.get('database.dialect')
};
exports.sequelize = new sequelize_1.Sequelize(sequelizeOptions);
const roles = Array.isArray(config_1.default.get('user.roles'))
    ? config_1.default.get('user.roles')
    : ['admin', 'dbadmin', 'driver'];
class User extends sequelize_1.Model {
}
exports.User = User;
const userFields = {
    username: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING
    },
    role: {
        type: sequelize_1.DataTypes.ENUM(...roles),
        defaultValue: (_a = config_1.default.get('user.defaultRole')) !== null && _a !== void 0 ? _a : 'driver',
        allowNull: false
    }
};
const userInitOptions = {
    sequelize: exports.sequelize,
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
