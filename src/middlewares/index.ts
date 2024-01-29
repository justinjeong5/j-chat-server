import Logger from "@lib/logger";
import bodyParser from "@middlewares/bodyParser";
import cookieParser from "@middlewares/cookieParser";
import cors from "@middlewares/cors";
import registerSocket from "@middlewares/registerSocket";
import requestCasing from "@middlewares/requestCasing";
import responseCasing from "@middlewares/responseCasing";
import routingLogger from "@middlewares/routingLogger";
import { Application } from "express";
import { Server } from "socket.io";

const initMiddleware = (app: Application, io: Server): void => {
    bodyParser(app);
    cookieParser(app);
    cors(app);
    registerSocket(app, io);
    requestCasing(app);
    responseCasing(app);
    routingLogger(app);

    Logger.done("successfully loaded middlewares");
};

export default initMiddleware;
