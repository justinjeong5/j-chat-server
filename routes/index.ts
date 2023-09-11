import user from "./user";

const routeHandler = (app: any) => {
    app.use("/user", user);
};

export default routeHandler;
