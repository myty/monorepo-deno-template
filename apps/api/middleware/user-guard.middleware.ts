import { Context, UserRole } from '../types.ts';
import { hasUserRole } from '../helpers/roles.ts';
import { httpErrors } from '../deps.ts';

/**
 * has user role middleware
 * checks authorization for context user, user roles
 */
const userGuard = (roles?: UserRole | UserRole[]) => {
    return async (ctx: Context, next: () => Promise<unknown>) => {
        // if auth user not found, throw error
        const { authUser } = ctx;
        if (!authUser) {
            throw new httpErrors.Unauthorized('Unauthorized user');
        }

        //if roles specified, then check auth user's roles
        if (roles) {
            const isRoleMatched = hasUserRole(authUser, roles);

            //if no role mached throw forbidden error
            if (!isRoleMatched) {
                throw new httpErrors.Forbidden('Forbidden user role');
            }
        }

        await next();
    };
};

export { userGuard };
