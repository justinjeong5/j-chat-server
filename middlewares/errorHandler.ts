/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Application, NextFunction, Request, Response } from "express";
import { Error } from "types/error.type";

const errorHandlerMiddleware = (app: Application): void => {
    const debug = process.env.NODE_ENV !== "production";

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        const error = {
            ...err,
            code: err.code || "ERROR.UNKNOWN",
            message: err.message,
            stack: debug && err.stack,
        };
        delete error.status;

        res.status(err.status || 500).send(error);
    });
};

export default errorHandlerMiddleware;
