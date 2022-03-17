import { OakContext } from '../../deps.ts';
import { AuthUser } from '../auth/auth-user.ts';

/**
 * Custom appilication context
 */
export class Context extends OakContext {
    authUser?: AuthUser;
}
