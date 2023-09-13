import { convertToCamelCase } from "@lib/casing";
import { Application, NextFunction, Request, Response } from "express";

function camelCasingMiddleware(
    req: Request,
    res: Response & { locals: { responseBody?: any } },
    next: NextFunction,
): void {
    req.body = convertToCamelCase(req.body);
    res.locals.responseBody = {};

    const { json } = res;
    res.json = function overrideJson(body?: any): Response {
        this.locals.responseBody = body;
        json.call(this, convertToCamelCase(this.locals.responseBody));

        return this;
    };

    next();
}

const responseCasingMiddleware = (app: Application): void => {
    app.use(camelCasingMiddleware);
};

export default responseCasingMiddleware;
