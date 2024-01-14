import * as bodyParser from "body-parser";
import { Application } from "express";

const bodyParserMiddleware = (app: Application): void => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
};

export default bodyParserMiddleware;
