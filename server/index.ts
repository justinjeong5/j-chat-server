import initMiddleware from "@middlewares/index";
import initRouter from "@routes/index";
import initDatabase from "@server/database";
import dotenv from "dotenv";
import express, { Application } from "express";

(async () => {
    const app: Application = express();
    dotenv.config();

    console.log("Initializing Database...");
    await initDatabase();

    console.log("Initializing Middlewares...");
    initMiddleware(app);

    console.log("Initializing Routers...");
    initRouter(app);

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    const port = process.env.PORT || 3005;
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
})();
