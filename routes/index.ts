import { notFound } from "@lib/exception/error";
import Logger from "@lib/logger";
import errorHandler from "@middlewares/errorHandler";
import room from "@routes/room";
import user from "@routes/user";
import { Application } from "express";

const routeHandler = (app: Application): void => {
    app.use("/room", room);
    app.use("/user", user);

    app.use((req, res, next) => {
        next(notFound());
    });

    errorHandler(app);

    Logger.done("successfully loaded routes");
};

export default routeHandler;
