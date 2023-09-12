import bodyParser from "@middlewares/bodyParser";
import cookieParser from "@middlewares/cookieParser";
import cors from "@middlewares/cors";
import { Application } from "express";

const initMiddleware = (app: Application): void => {
    bodyParser(app);
    cookieParser(app);
    cors(app);
};

export default initMiddleware;
