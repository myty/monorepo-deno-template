// deno-lint-ignore-file no-explicit-any

// Type Definitions

type SuccessResult<T = any> = {
    resultObject: T;
};

enum ErrorType {
    Error = 0,
    ValidationError = 1,
}

type Error = {
    key: string;
    message?: string;
    type: ErrorType;
};

type ErrorResult = {
    errors: Error[];
};

type MaybeArray<T> = T | T[];

export type AnyResult<T = any> = SuccessResult<T> | ErrorResult;

// Result Implementaion

export const Result = {
    success<T>(value: T): SuccessResult<T> {
        return {
            resultObject: value,
        };
    },
    error(errors: MaybeArray<Partial<Error>> = {}): ErrorResult {
        errors = Array.isArray(errors) ? errors : [errors];

        return {
            errors: errors.map((error) => ({
                type: error.type ?? ErrorType.Error,
                key: error.key ?? 'ERROR',
                message: error.message,
            })),
        };
    },
};
