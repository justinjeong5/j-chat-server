import initMiddleware from "@middlewares/index";
import initRouter from "@routes/index";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();
const app = express();

mongoose
    .connect(process.env.MONGODB_URL, {
        dbName: process.env.MONGODB_DB_NAME,
    })
    .then(() => {
        console.log("successfully connected to database");
    })
    .catch(error => {
        console.error(error);
    });

console.log("Intializing Middlewares");
initMiddleware(app);

console.log("Intializing Routers");
initRouter(app);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const port = 3005;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
