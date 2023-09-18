import Logger from "@lib/logger";
import bodyParser from "@middlewares/bodyParser";
import cookieParser from "@middlewares/cookieParser";
import cors from "@middlewares/cors";
import requestCasing from "@middlewares/requestCasing";
import responseCasing from "@middlewares/responseCasing";
import routingLogger from "@middlewares/routingLogger";
import { Application } from "express";

const initMiddleware = (app: Application): void => {
    bodyParser(app);
    cookieParser(app);
    cors(app);
    requestCasing(app);
    responseCasing(app);
    routingLogger(app);

    Logger.done("successfully loaded middlewares");
};

export default initMiddleware;
