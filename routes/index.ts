import user from "@routes/user";
import { Application } from "express";

const routeHandler = (app: Application): void => {
    app.use("/user", user);

    console.log("successfully loaded routes");
};

export default routeHandler;
