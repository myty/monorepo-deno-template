import { DataTypes, Model } from '../../deps.ts';
import UserModel, { User } from './user-model.ts';

export enum RoleType {
    USER,
    ADMIN,
}

export interface Role {
    id?: string;
    type: RoleType;
    description: string;
}

export const UserRoles: Record<string, Role> = {
    USER: { type: RoleType.USER, description: 'User' },
    ADMIN: { type: RoleType.ADMIN, description: 'Admin' },
};

export default class RoleModel extends Model implements Role {
    static table = 'roles';
    static timestamps = true;

    static fields = {
        id: { primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING,
    };

    id!: string;
    type!: RoleType;
    description!: string;

    static async users(): Promise<User[]> {
        return (await this.hasMany(UserModel)) as unknown as UserModel[];
    }
}
