export const unknownError = (message?: string): Error => {
    const err = new Error("Unknown error");
    return Object.assign(err, {
        status: 400,
        code: "ERROR.UNKNOWN",
        message,
    });
};

export const parameterRequired = (
    paramName: string,
    message?: string,
): Error => {
    const err = new Error(`'${paramName}' is required`);
    return Object.assign(err, {
        status: 400,
        code: "ERROR.PARAMETER_REQUIRED",
        message,
    });
};

export const parameterInvalid = (
    paramName: string,
    message?: string,
): Error => {
    const err = new Error(`'${paramName}' should be provided`);
    return Object.assign(err, {
        status: 400,
        code: "ERROR.PARAMETER_INVALID",
        message,
    });
};

export const alreadyExist = (message?: string): Error => {
    const err = new Error("already exist request");
    return Object.assign(err, {
        status: 401,
        code: "ERROR.ALREADY_EXIST",
        message,
    });
};

export const notFound = (message?: string): Error => {
    const err = new Error("Not found");
    return Object.assign(err, {
        status: 404,
        code: "ERROR.NOT_FOUND",
        message,
    });
};

export const userInvalidCredentials = (message?: string): Error => {
    const err = new Error("User credentials invalid");
    return Object.assign(err, {
        status: 401,
        code: "ERROR.USER_INVALID_CREDENTIALS",
        message,
    });
};

export const userNotAuthenticated = (message?: string): Error => {
    const err = new Error("User not authenticated");
    return Object.assign(err, {
        status: 401,
        code: "ERROR.USER_NOT_AUTHENTICATED",
        message,
    });
};
