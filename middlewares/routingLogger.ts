import Logger from "@lib/logger";
import { Application, NextFunction, Request, Response } from "express";

function routingLogger(req: Request, res: Response, next: NextFunction): void {
    Logger.info({
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        query: req.query,
    });
    next();
}

const routingLoggerMiddleware = (app: Application): void => {
    app.use(routingLogger);
};

export default routingLoggerMiddleware;
