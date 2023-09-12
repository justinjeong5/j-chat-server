import * as bodyParser from "body-parser";

const bodyParserMiddleware = (app: any) => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
};

export default bodyParserMiddleware;
