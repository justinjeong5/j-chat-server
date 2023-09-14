/* eslint-disable no-underscore-dangle */
import isFalsy from "@lib/compare/isFalsy";
import isValidObjectId from "@lib/compare/isValidObjectId";
import Logger from "@lib/logger";
import auth from "@middlewares/auth";
import History from "@models/History";
import User from "@models/User";
import bcrypt from "bcryptjs";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const R = express();

interface IRequestWithUser extends Request {
    user: object;
}

R.get("/init", async (req: IRequestWithUser, res: Response): Promise<void> => {
    res.json(req.user);
});

R.post("/signup", async (req: Request, res: Response): Promise<void> => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
        res.status(400).json({ error: "User already exists" });
        return;
    }

    const doc = await (await User.create(req.body)).save();

    res.json(doc.toObject());
});

R.post("/login", async (req: Request, res: Response): Promise<void> => {
    const userFound = await User.findOne({ email: req.body.email });

    if (!userFound) {
        res.status(400).json({ error: "User not found" });
        return;
    }

    const isMatchedPassword = await bcrypt.compare(
        req.body.password,
        userFound.password,
    );

    if (!isMatchedPassword) {
        res.status(400).json({ error: "Invalid password" });
        return;
    }

    const token = jwt.sign({ userId: userFound._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });

    res.cookie("j_chat_access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 3600,
    });

    res.json({ token, user: userFound.toObject() });
});

R.patch(
    "/users/:userId",
    auth,
    async (req: Request, res: Response): Promise<void> => {
        if (isFalsy(req.params.userId)) {
            res.status(400).json({
                msg: "User ID is required",
            });
            return;
        }

        if (!isValidObjectId(req.params.userId)) {
            res.status(400).json({
                msg: "User ID is not valid",
            });
            return;
        }

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
        res.status(200).json(doc.toObject());
    },
);

R.get(
    "/users/:userId",
    auth,
    async (req: Request, res: Response): Promise<void> => {
        if (isFalsy(req.params.userId)) {
            res.status(400).json({
                msg: "User ID is required",
            });
            return;
        }

        if (!isValidObjectId(req.params.userId)) {
            res.status(400).json({
                msg: "User ID is not valid",
            });
            return;
        }

        Logger.info({ method: "GET", url: req.originalUrl });
        const user = await User.findOne({ _id: req.params.userId }).exec();
        if (!user) {
            res.status(404).json({
                msg: "User not found",
            });
            return;
        }

        res.status(200).json(user.toObject());
    },
);

R.post("/users", auth, async (req: Request, res: Response): Promise<void> => {
    const user = await User.findOne({ email: req.body.email }).exec();

    if (user) {
        res.status(400).json({
            msg: "User already exists",
        });
        return;
    }

    const doc = await (await User.create(req.body)).save();
    res.status(201).json(doc.toObject());
});

R.get("/users", auth, async (req: Request, res: Response): Promise<void> => {
    const docs = await User.find();

    res.status(200).json({
        results: docs.map(doc => doc.toObject()),
        count: docs.length,
    });
});

export default R;
