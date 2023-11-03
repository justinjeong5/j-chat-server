import corsConfig from "@lib/api/cors";
import cors from "cors";
import { Application } from "express";

const corsMiddleware = (app: Application): void => {
    app.use(cors(corsConfig));
};

export default corsMiddleware;
