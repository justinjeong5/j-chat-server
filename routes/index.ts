import user from "@routes/user";
import { Application } from "express";

const routeHandler = (app: Application): void => {
    app.use("/user", user);
};

export default routeHandler;
