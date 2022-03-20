import { helpers, httpErrors, Status } from '../../deps.ts';
import { hasUserRole } from '../../helpers/roles.ts';
import { userGuard } from '../../middleware/index.ts';
import UserModel, { User } from '../../db/models/user-model.ts';
import { Result } from '../../result.ts';
import { Context, UserRole } from '../../types.ts';

interface UpdateUserRequestDto {
    email: string;
    username: string;
}

async function _updateUser(id: string, userDto: UpdateUserRequestDto) {
    try {
        const user = await UserModel.find(id) as UserModel;
        user.email = userDto.email;
        user.username = userDto.username;
        await user.update();

        return Result.success(user as User);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return Result.error({ error: { message: err.message } });
        }

        return Result.error();
    }
}

/**
 * update user
 * call by user themself or ADMIN
 */
export const updateUser = [
    userGuard(),
    /** router handler */
    async (ctx: Context) => {
        /** get user id from params */
        const { id } = helpers.getQuery(ctx, { mergeParams: true });

        /** auth user */
        const { authUser } = ctx;

        if (authUser) {
            if (id === authUser.id || hasUserRole(authUser, UserRole.ADMIN)) {
                const request = ctx.request;
                const userData = await request.body().value;

                const updateUserResult = await _updateUser(id, userData);

                if (Result.isErrorResult(updateUserResult)) {
                    throw new httpErrors.InternalServerError(
                        'User was not updated',
                    );
                }

                ctx.response.body = updateUserResult;
                ctx.response.status = Status.Created;
                ctx.response.type = 'json';
                return;
            }
        }

        throw new httpErrors.Forbidden('Forbidden user role');
    },
] as const;
