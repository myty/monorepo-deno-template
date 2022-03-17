/**
 * Authenticated user info
 * user as JWT access token payload
 */
export type AuthUser = {
    /** user id */
    id: string;
    /** user email address */
    email: string;
    /** user name */
    name: string;
    /** user roles */
    roles: string;
};
