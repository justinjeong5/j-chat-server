import cors from "cors";

const corsMiddleware = (app: any) => {
    app.use(
        cors({
            origin: [/^http:\/\/localhost/],
            credentials: true,
        }),
    );
};

export default corsMiddleware;
