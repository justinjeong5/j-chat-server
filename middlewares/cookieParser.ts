import cookieParser from "cookie-parser";

const cookieParserMiddleware = (app: any) => {
    app.use(cookieParser());
};

export default cookieParserMiddleware;
