import { DataTypes, Model } from '../deps.ts';

export default class LogEntry extends Model {
    static table = 'log_entries';
    static timestamps = true;

    static fields = {
        id: { primaryKey: true, autoIncrement: true },
        title: DataTypes.STRING,
        message: DataTypes.STRING,
        json: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    };

    _id!: string;
    message!: string;
    title!: string;
    json!: string;
}
