/** Request body to create user */
export type CreateUser = {
    username: string;
    /** user name */
    name: string;
    /** user email */
    email: string;
    /** user password */
    password: string;
    /** roles */
};
