import { helpers, httpErrors } from '../../deps.ts';
import { hasUserRole } from '../../helpers/roles.ts';
import { userGuard } from '../../middlewares/user-guard.middleware.ts';
import { UserModel } from '../../models/index.ts';
import { User } from '../../models/user.ts';
import { Result } from '../../result.ts';
import { Context, UserRole } from '../../types.ts';

async function getUser(id: string) {
    try {
        const user = await UserModel.find(id);

        return Result.success(user as unknown as User);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return Result.error({ message: err.message });
        }

        return Result.error();
    }
}

/**
 * get user by id
 * call by ADMIN
 */
export const getUserById = [
    userGuard(),
    async (ctx: Context) => {
        /** get user id from params */
        const { id } = helpers.getQuery(ctx, { mergeParams: true });

        /** auth user */
        const { authUser } = ctx;

        if (authUser) {
            if (id === authUser.id || hasUserRole(authUser, UserRole.ADMIN)) {
                const user = await getUser(id);
                ctx.response.body = user;
            }
        }

        throw new httpErrors.Forbidden('Forbidden user role');
    },
] as const;
