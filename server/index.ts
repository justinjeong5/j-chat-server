import Logger from "@lib/logger";
import initMiddleware from "@middlewares/index";
import initRouter from "@routes/index";
import initDatabase from "@server/database";
import dotenv from "dotenv";
import express, { Application } from "express";

(async () => {
    try {
        const app: Application = express();
        dotenv.config();

        Logger.init("Initializing Database...");
        await initDatabase();

        Logger.init("Initializing Middlewares...");
        initMiddleware(app);

        Logger.init("Initializing Routers...");
        initRouter(app);

        app.get("/", (req, res) => {
            res.send("Hello World!");
        });

        const port = process.env.PORT || 3005;
        app.listen(port, () => {
            Logger.init(`Server listening on port ${port}`);
        });
    } catch (err) {
        Logger.error(err);
    }
})();
