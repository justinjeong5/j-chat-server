import Logger from "@lib/logger";
import user from "@routes/user";
import { Application } from "express";

const routeHandler = (app: Application): void => {
    app.use("/user", user);

    Logger.done("successfully loaded routes");
};

export default routeHandler;
