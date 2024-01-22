import { notFound } from "@lib/exception/error";
import Logger from "@lib/logger";
import errorHandler from "@middlewares/errorHandler";
import dialog from "@routes/dialog";
import room from "@routes/room";
import user from "@routes/user";
import { Application } from "express";

const routeHandler = (app: Application): void => {
    app.use("/dialog", dialog);
    app.use("/room", room);
    app.use("/user", user);

    app.use("/health", (req, res) => {
        res.status(201).json({ status: "ok" });
    });

    app.use((req, res, next) => {
        next(notFound());
    });

    errorHandler(app);

    Logger.done("successfully loaded routes");
};

export default routeHandler;
