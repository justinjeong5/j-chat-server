import cors from "cors";
import { Application } from "express";

const corsMiddleware = (app: Application): void => {
    app.use(
        cors({
            origin: [/^http:\/\/localhost/],
            credentials: true,
        }),
    );
};

export default corsMiddleware;
