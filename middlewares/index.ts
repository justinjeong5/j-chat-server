import bodyParser from "@middlewares/bodyParser";
import cookieParser from "@middlewares/cookieParser";
import cors from "@middlewares/cors";
import errorHandler from "@middlewares/errorHandler";
import { Application } from "express";

const initMiddleware = (app: Application): void => {
    bodyParser(app);
    cookieParser(app);
    cors(app);
    errorHandler(app);
    console.log("successfully loaded middlewares");
};

export default initMiddleware;
