import { Application, NextFunction, Response } from "express";
import { Server } from "socket.io";
import { ISocketRequest } from "types/response.type";

const registerSocketMiddleware = (app: Application, socket: Server): void => {
    app.use(function callback(
        req: ISocketRequest,
        _: Response,
        next: NextFunction,
    ) {
        req.io = socket;
        next();
    });
};

export default registerSocketMiddleware;
