import express from "express";

import User from "../models/User";

const app = express();

app.use("/users", async (req, res) => {
    const docs = await User.find({ name: "A" }).exec();
    console.log(docs);
    res.status(200).json({
        data: docs,
    });
});

export default app;
