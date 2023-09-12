import { Error } from "@types/error.type";
import { Application, NextFunction, Request, Response } from "express";

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
