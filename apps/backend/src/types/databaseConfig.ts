import { Options } from "sequelize"

export type DatabaseConfig = {
    url?: string,
    options: Options,
    connect?: boolean
}