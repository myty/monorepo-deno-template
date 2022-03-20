import { userGuard } from '../../middleware/index.ts';
import UserModel, { User } from '../../db/models/user-model.ts';
import { AnyResult, Result } from '../../result.ts';
import { Context, UserRole } from '../../types.ts';

async function _getUsers(): Promise<AnyResult<User[]>> {
    try {
        const users = await UserModel.skip(0).take(25).get();

        return Result.success(
            (Array.isArray(users) ? users : [users]) as unknown as User[],
        );
    } catch (err: unknown) {
        if (err instanceof Error) {
            return Result.error({ error: { message: err.message } });
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
