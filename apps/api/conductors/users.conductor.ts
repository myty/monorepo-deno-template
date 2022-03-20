import RoleModel, { Role, RoleType } from '../db/models/role-model.ts';
import UserModel, { User } from '../db/models/user-model.ts';
import UserRoleModel from '../db/models/user-role-model.ts';

export const createUser = async (
    user: User,
    roleTypes: RoleType[] = [RoleType.USER],
): Promise<User & { roles: Role[] }> => {
    const model = { ...user };
    let roles: Role[] = [];

    try {
        await UserModel.create(model);

        if (model.id == null) {
            throw new Error('User was not created');
        }

        const allRoles = (await RoleModel.all()) as unknown as Role[];
        roles = allRoles
            .filter((role) => roleTypes.includes(role.type));

        // Bind each role to the user
        await UserRoleModel.create(
            roles.map((role) => ({ userId: model.id!, roleId: role.id! })),
        );
    } catch (err) {
        const { message } = err;

        /** handle duplicate email issue */
        if (message.match('email_unique')) {
            throw new Error(
                `Already user exists with email ${model.email}`,
            );
        }

        throw err;
    }

    return { ...model, roles };
};

export const getUserByEmail = async (email: string): Promise<User> => {
    const user = await UserModel.where('email', email).first();

    return user as unknown as User;
};

export const getUserById = async (id: string): Promise<User> => {
    const user = await UserModel.find(id);

    return user as unknown as User;
};
