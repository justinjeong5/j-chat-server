import Logger from "@lib/logger";
import History from "@models/History";
import User from "@models/User";
import express, { Request, Response } from "express";

const R = express();

R.post("/login", async (req: Request, res: Response): Promise<void> => {
    res.send(200);
});

R.patch(
    "/users/:userId",
    async (req: Request, res: Response): Promise<void> => {
        Logger.info({ method: "PATCH", url: req.originalUrl, body: req.body });
        const user = await User.findOne({ _id: req.params.userId }).exec();
        if (!user) {
            res.status(404).json({
                msg: "User not found",
            });
            return;
        }
        await User.findOneAndUpdate({ id: user.id }, req.body);
        const doc = await User.findOne({ id: user.id });
        await (
            await History.create({
                user_id: user.id,
                model: "User",
                model_id: user.id,
                url: req.originalUrl,
                method: "PATCH",
                status: "200",
                response: JSON.stringify(doc),
            })
        ).save();
        res.status(200).json({ data: doc });
    },
);

R.get("/users/:userId", async (req: Request, res: Response): Promise<void> => {
    Logger.info({ method: "GET", url: req.originalUrl });
    const user = await User.findOne({ _id: req.params.userId }).exec();
    if (!user) {
        res.status(404).json({
            msg: "User not found",
        });
        return;
    }

    res.status(200).json({ data: user });
});

R.post("/users", async (req: Request, res: Response): Promise<void> => {
    const user = await User.findOne({ email: req.body.email }).exec();

    if (user) {
        res.status(400).json({
            msg: "User already exists",
        });
        return;
    }

    const doc = (await User.create(req.body)).save();
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
