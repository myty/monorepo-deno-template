import { dotEnvConfig } from '../deps.ts';

dotEnvConfig({ export: true });

export const config = {
    env: Deno.env.toObject(),
};
