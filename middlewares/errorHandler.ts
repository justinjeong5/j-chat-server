import { Application, NextFunction, Request, Response } from "express";

import { Error } from "../types/error.type";

const errorHandlerMiddleware = (app: Application): void => {
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        const error = {
            ...err,
            msg: err.msg || "ERROR.UNKNOWN",
        };

        res.status(error.status).send({ error });
        next(error);
    });
};

export default errorHandlerMiddleware;
