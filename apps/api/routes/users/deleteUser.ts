import { helpers, httpErrors, Status } from '../../deps.ts';
import { userGuard } from '../../middleware/index.ts';
import UserModel from '../../db/models/user-model.ts';
import { Result } from '../../result.ts';
import { Context, UserRole } from '../../types.ts';

async function _deleteUser(id: string) {
    try {
        const user = await UserModel.find(id) as UserModel;
        await user.delete();

        return Result.success(true);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return Result.error({ error: { message: err.message } });
        }

        return Result.error();
    }
}

/**
 * Delete user by admin user
 */
export const deleteUser = [
    userGuard(UserRole.ADMIN),
    async (ctx: Context) => {
        const { id } = helpers.getQuery(ctx, { mergeParams: true });
        const result = await _deleteUser(id);

        if (Result.isErrorResult(result) || result.resultObject != true) {
            throw new httpErrors.InternalServerError('User was not deleted');
        }

        ctx.response.status = Status.NoContent;
    },
] as const;
