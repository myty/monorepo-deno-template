import { httpErrors } from '../deps.ts';
import * as encryption from '../helpers/encryption.ts';
import * as jwt from '../helpers/jwt.ts';
import { CreateUser, LoginCredential } from '../types.ts';
import UserModel, { User } from '../db/models/user-model.ts';
import * as UsersConductor from '../conductors/users.conductor.ts';
import { AuthUser } from '../types/auth/auth-user.ts';
import { Role } from '../db/models/role-model.ts';

/**
 * register user
 */
export const registerUser = async (userData: CreateUser) => {
    try {
        /** encrypt user's plain password */
        const { password } = userData;
        userData.password = await encryption.encrypt(password);

        // Add default user role
        return await UsersConductor.createUser({ ...userData, isActive: true });
    } catch (err) {
        /** handle duplicate email issue */
        const { message } = err;
        if (message.match('email_unique')) {
            throw new httpErrors.BadRequest(
                `Already user exists with email ${userData.email}`,
            );
        }
        throw err;
    }
};

const toAuthUser = (user: User, roles: Role[]): AuthUser => {
    const { id, email, name } = user;

    if (id == null) {
        throw new Error('User not valid');
    }

    return {
        id,
        email,
        name,
        roles: roles.map((role) => role.type).join(','),
    };
};

/**
 * login user
 */
export const loginUser = async (credential: LoginCredential) => {
    /** find user by email */
    const { email, password } = credential;
    const user = await UsersConductor.getUserByEmail(email);
    const roles = await UserModel.roles();

    if (user?.password != null) {
        /** check user active status */
        if (user.isActive) {
            /** check password */
            const passHash = user.password;
            const isValidPass = await encryption.compare(password, passHash);
            const authUser = toAuthUser(user, roles);

            /** return token */
            if (isValidPass) {
                return {
                    'access_token': jwt.getAuthToken(authUser),
                    'refresh_token': jwt.getRefreshToken(authUser),
                };
            }
        }
    }

    throw new httpErrors.Unauthorized('Wrong credential');
};

export const refreshToken = async (token: string) => {
    try {
        // TODO(@myty): check token intention
        const payload = await jwt.getJwtPayload(token);
        if (payload) {
            /** get user from token */
            const id = payload.id as string;
            const user = await UsersConductor.getUserById(id);
            const roles = await UserModel.roles();

            if (user) {
                /** check user active status */
                if (!user.isActive) {
                    throw new httpErrors.Unauthorized('Inactive user status');
                }

                const authUser = toAuthUser(user, roles);

                return {
                    'access_token': jwt.getAuthToken(authUser),
                    'refresh_token': jwt.getRefreshToken(authUser),
                };
            }
        }
    } catch (err) {
        throw new httpErrors.Unauthorized('Invalid token object');
    }
};
