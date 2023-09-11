import express from "express";

import User from "../models/User";

const R = express();

R.get("/users", async (req, res) => {
    const docs = await User.find();

    res.status(200).json({
        data: docs,
    });
});

R.post("/users", async (req, res) => {
    const { username, email, password, avatar } = req.body;
    const userExist = await User.find({ username }).exec();

    if (userExist.length) {
        res.status(400).json({
            message: "User already exists",
        });
        return;
    }

    const user = await User.create({
        username,
        email,
        password,
        avatar,
    });
    const doc = await user.save();
    res.status(201).json({
        data: doc,
    });
});

export default R;
