import {
    Context,
    CreateUser,
    LoginCredential,
    RefreshToken,
} from '../../types.ts';
import {
    isEmail,
    lengthBetween,
    required,
} from 'https://deno.land/x/validasaur@v0.7.0/src/rules.ts';
import { requestValidator } from '../../middleware/index.ts';
import * as authService from '../../services/auth.service.ts';

/**
 * request body schema
 * for user create/update
 */
const registrationSchema = {
    name: [required],
    email: [required, isEmail],
    password: [required, lengthBetween(6, 12)],
};

// TODO(@myty): add validation alphanumeric, spechal char

/**
 * register user
 */
const register = [
    /** request validation middleware */
    requestValidator({ bodyRules: registrationSchema }),
    /** router handler */
    async (ctx: Context) => {
        const request = ctx.request;
        const userData: CreateUser = await request.body().value;
        const user = await authService.registerUser(userData);
        ctx.response.body = user;
    },
] as const;

/**
 * login body schema
 * for user create/update
 */
const loginSchema = {
    email: [required, isEmail],
    password: [required, lengthBetween(6, 12)],
};

const login = [
    /** request validation middleware */
    requestValidator({ bodyRules: loginSchema }),
    /** router handler */
    async (ctx: Context) => {
        const request = ctx.request;
        const credential: LoginCredential = await request.body().value;
        const token = await authService.loginUser(credential);
        ctx.response.body = token;
    },
] as const;

const refreshTokenSchema = { refresh_token: [required] };
const refreshToken = [
    /** request validation middleware */
    requestValidator({ bodyRules: refreshTokenSchema }),
    /** router handler */
    async (ctx: Context) => {
        const request = ctx.request;
        const data: RefreshToken = await request.body().value;
        const token = await authService.refreshToken(
            data['refresh_token'],
        );

        ctx.response.body = token;
    },
] as const;

export { login, refreshToken, register };
