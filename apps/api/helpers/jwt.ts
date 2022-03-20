import { create, getNumericDate, Header, Payload, verify } from '../deps.ts';
import { config } from './../config/config.ts';
import { AuthUser } from '../types.ts';

const { JWT_ACCESS_TOKEN_EXP } = config.env;

const key = await crypto.subtle.generateKey(
    { name: 'HMAC', hash: 'SHA-512' },
    true,
    ['sign', 'verify'],
);

const header: Header = {
    alg: 'HS512',
    typ: 'JWT',
};

const getAuthToken = async (user: AuthUser) => {
    const payload: Payload = {
        iss: 'deno-api',
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        exp: getNumericDate(parseInt(JWT_ACCESS_TOKEN_EXP)),
    };

    return await create(header, payload, key);
};

const getRefreshToken = async (user: AuthUser) => {
    const payload: Payload = {
        iss: 'deno-api',
        id: user.id,
        exp: getNumericDate(parseInt(JWT_ACCESS_TOKEN_EXP)),
    };

    return await create(header, payload, key);
};

const getJwtPayload = async (jwt: string) => {
    try {
        return await verify(jwt, key);
    } catch (error) {
        // TODO(@myty): Add logging
        throw error;
    }
};

export { getAuthToken, getJwtPayload, getRefreshToken };
