import { convertToCamelCase } from "@lib/casing";
import { Application, NextFunction, Request, Response } from "express";
import { TCommon } from "types/common.type";

function camelCasingMiddleware(
    req: Request,
    res: Response & { locals: { responseBody?: TCommon } },
    next: NextFunction,
): void {
    req.body = convertToCamelCase(req.body);
    res.locals.responseBody = {};

    const { json } = res;
    res.json = function overrideJson(body?: TCommon): Response {
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
