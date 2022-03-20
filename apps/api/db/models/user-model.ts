import { DataTypes, Model } from '../../deps.ts';
import RoleModel, { Role } from './role-model.ts';

export interface User {
    id?: string;
    username: string;
    isActive: boolean;
    email: string;
    name: string;
    password?: string;
    salt?: string;
}

export default class UserModel extends Model implements User {
    static table = 'users';
    static timestamps = true;

    static fields = {
        id: { primaryKey: true, autoIncrement: true },
        email: { type: DataTypes.STRING, unique: true },
        isActive: { default: true, type: DataTypes.BOOLEAN },
        username: { type: DataTypes.STRING, unique: true },
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        salt: DataTypes.STRING,
    };

    id!: string;
    isActive!: boolean;
    email!: string;
    name!: string;
    username!: string;

    static async roles(): Promise<Role[]> {
        return (await this.hasMany(RoleModel)) as unknown as RoleModel[];
    }
}
