import authMiddleware from "@middlewares/auth";
import Message from "@models/Message";
import express, { Request, Response } from "express";

const R = express();

R.post(
    "/dialog",
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        const doc = await (await Message.create(req.body)).save();
        res.status(201).json(doc.toJSON());
    },
);

export default R;
