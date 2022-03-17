import { DataTypes, Model } from '../deps.ts';

export interface User {
    id?: string;
    username: string;
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
        email: DataTypes.STRING,
        username: DataTypes.STRING,
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        salt: DataTypes.STRING,
    };

    _id!: string;
    email!: string;
    name!: string;
    username!: string;
    password!: string;
    salt!: string;
}
