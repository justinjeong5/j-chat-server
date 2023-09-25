import cors from "cors";
import { Application } from "express";

const corsMiddleware = (app: Application): void => {
    app.use(
        cors({
            origin: [
                /^http:\/\/localhost/,
                /^https:\/\/j-chat-(\w+(-\w+)*)*\.vercel\.app/,
            ],
            credentials: true,
        }),
    );
};

export default corsMiddleware;
