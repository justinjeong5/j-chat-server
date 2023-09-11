import express from "express";

const app = express();

app.use("/users", (req, res) => {
    return res.send("[Routes]: Users!");
});

export default app;
