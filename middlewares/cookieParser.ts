import cookieParser from "cookie-parser";
import { Application } from "express";

const cookieParserMiddleware = (app: Application): void => {
    app.use(cookieParser());
};

export default cookieParserMiddleware;
