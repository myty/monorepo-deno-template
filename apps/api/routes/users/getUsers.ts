import { userGuard } from '../../middlewares/user-guard.middleware.ts';
import { User } from '../../models/user.ts';
import { AnyResult, Result } from '../../result.ts';
import { Context, UserRole } from '../../types.ts';
import { UserModel } from '../../models/index.ts';
import { RouterMiddleware } from 'https://deno.land/x/oak@v10.4.0/router.ts';

async function _getUsers(): Promise<AnyResult<User[]>> {
    try {
        const users = await UserModel.skip(0).take(25).get();

        return Result.success(
            (Array.isArray(users) ? users : [users]) as unknown as User[],
        );
    } catch (err: unknown) {
        if (err instanceof Error) {
            return Result.error({ message: err.message });
        }

        return Result.error();
    }
}

/**
 * get list of users
 * call by ADMIN
 */
export const getUsers = [
    userGuard(UserRole.ADMIN),
    async (ctx: Context) => {
        ctx.response.body = await _getUsers();
    },
] as const;
