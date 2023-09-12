import Logger from "@lib/logger";
import room from "@routes/room";
import user from "@routes/user";
import { Application } from "express";

const routeHandler = (app: Application): void => {
    app.use("/room", room);
    app.use("/user", user);

    Logger.done("successfully loaded routes");
};

export default routeHandler;
