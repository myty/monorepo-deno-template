import { Context } from './../types.ts';

/**
 * requestId middleware
 * attach requestId in request & response header
 */
const requestIdMiddleware = async (
    ctx: Context,
    next: () => Promise<unknown>,
) => {
    let requestId = ctx.request.headers.get('X-Response-Id');
    if (!requestId) {
        /** if request id not being set, set unique request id */
        requestId = crypto.randomUUID();
        ctx.request.headers.set('X-Response-Id', requestId.toString());
    }
    await next();

    /** add request id in response header */
    ctx.response.headers.set('X-Response-Id', requestId);
};

export { requestIdMiddleware };
