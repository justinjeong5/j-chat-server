/* eslint-disable import/no-extraneous-dependencies */
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import initRouter from "../routes";

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
);

initRouter(app);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const port = 3005;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
