import { bcrypt } from '../deps.ts';

/**
 * encrypt given string
 */
const encrypt = async (password: string) => {
    return await bcrypt.hash(password);
};

/**
 * compare given password and hash
 */
const compare = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export { compare, encrypt };
