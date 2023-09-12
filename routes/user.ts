import User from "@models/User";
import express, { Request, Response } from "express";

const R = express();

R.patch(
    "/users/:userId",
    async (req: Request, res: Response): Promise<void> => {
        const [user] = await User.find({ _id: req.params.userId }).exec();
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        await User.findOneAndUpdate({ id: user.id }, req.body);
        const [user3] = await User.find({ id: user.id });
        res.status(200).json({ data: user3 });
    },
);

R.get("/users/:userId", async (req: Request, res: Response): Promise<void> => {
    const [user] = await User.find({ _id: req.params.userId }).exec();
    if (!user) {
        res.status(404).json({
            message: "User not found",
        });
        return;
    }

    res.status(200).json({ data: user });
});

R.post("/users", async (req: Request, res: Response): Promise<void> => {
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

R.get("/users", async (req: Request, res: Response): Promise<void> => {
    const docs = await User.find();

    res.status(200).json({
        data: docs,
    });
});

export default R;
