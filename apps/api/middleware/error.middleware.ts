import { isHttpError, Status } from '../deps.ts';
import { config } from './../config/config.ts';
import { Context } from './../types.ts';
import { Result } from '../result.ts';

const errorMiddleware = async (ctx: Context, next: () => Promise<unknown>) => {
    try {
        await next();
    } catch (err) {
        let message = err.message;
        const status = err.status || err.statusCode ||
            Status.InternalServerError;

        /**
         * considering all unhandled errors as internal server error,
         * do not want to share internal server errors to
         * end user in non "development" mode
         */
        if (!isHttpError(err)) {
            message =
                config.env.ENV === 'dev' || config.env.ENV === 'development'
                    ? message
                    : 'Internal Server Error';
        }

        if (config.env.ENV === 'dev' || config.env.ENV === 'development') {
            console.log(err);
        }

        ctx.response.status = status;
        ctx.response.body = Result.error({ status, error: { message } });
    }
};

export { errorMiddleware };
