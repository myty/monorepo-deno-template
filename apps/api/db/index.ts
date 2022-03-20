import RoleModel from './models/role-model.ts';
import UserModel from './models/user-model.ts';
import UserRoleModel from './models/user-role-model.ts';
import { Database, MySQLConnector } from '../deps.ts';
import { config } from '../config/config.ts';

const { env } = config;

export const connection = new MySQLConnector({
    database: env.MYSQL_DATABASE,
    host: env.MYSQL_HOST,
    password: env.MYSQL_PASSWORD,
    username: env.MYSQL_USERNAME,
});

export const database = new Database(connection);

export async function initialize() {
    database.link([UserModel, RoleModel, UserRoleModel]);

    await database.sync({ drop: true });
}
