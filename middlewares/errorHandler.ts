/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Application, NextFunction, Request, Response } from "express";

import { Error } from "../types/error.type";

type TErrors = Error & {
    status?: number;
    code: string;
    message?: string;
};

const errorHandlerMiddleware = (app: Application): void => {
    app.use((err: TErrors, req: Request, res: Response, next: NextFunction) => {
        const error = {
            ...err,
            code: err.code || "ERROR.UNKNOWN",
        };

        res.status(error.status || 500).send(error);
    });
};

export default errorHandlerMiddleware;
