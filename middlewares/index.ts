import bodyParser from "@middlewares/bodyParser";
import cookieParser from "@middlewares/cookieParser";
import cors from "@middlewares/cors";

const initMiddleware = (app: any) => {
    bodyParser(app);
    cookieParser(app);
    cors(app);
};

export default initMiddleware;
