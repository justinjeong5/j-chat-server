import { convertToSnakeCase } from "@lib/casing";
import { Application, NextFunction, Request, Response } from "express";

function snakeCasingMiddleware(
    req: Request,
    _: Response,
    next: NextFunction,
): void {
    req.body = convertToSnakeCase(req.body);
    next();
}

const requestCasingMiddleware = (app: Application): void => {
    app.use(snakeCasingMiddleware);
};

export default requestCasingMiddleware;
