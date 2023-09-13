import isFalsy from "@lib/compare/isFalsy";
import isValidObjectId from "@lib/compare/isValidObjectId";
import Logger from "@lib/logger";
import authMiddleware from "@middlewares/auth";
import History from "@models/History";
import Room from "@models/Room";
import express, { Request, Response } from "express";

const R = express();

R.patch(
    "/rooms/:roomId",
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        if (isFalsy(req.params.roomId)) {
            res.status(400).json({
                msg: "Room ID is required",
            });
            return;
        }

        if (!isValidObjectId(req.params.roomId)) {
            res.status(400).json({
                msg: "Room ID is not valid",
            });
            return;
        }

        Logger.info({ method: "PATCH", url: req.originalUrl, body: req.body });
        const room = await Room.findOne({ _id: req.params.roomId }).exec();
        if (!room) {
            res.status(404).json({
                msg: "Room not found",
            });
            return;
        }
        await Room.findOneAndUpdate({ id: room.id }, req.body);
        const doc = await Room.findOne({ id: room.id });
        await (
            await History.create({
                // user_id: user.id,
                model: "Room",
                model_id: room.id,
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
    "/rooms/:roomId",
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        if (isFalsy(req.params.roomId)) {
            res.status(400).json({
                msg: "Room ID is required",
            });
            return;
        }

        if (!isValidObjectId(req.params.roomId)) {
            res.status(400).json({
                msg: "Room ID is not valid",
            });
            return;
        }

        Logger.info({ method: "GET", url: req.originalUrl });
        const room = await Room.findOne({ _id: req.params.roomId }).exec();
        if (!room) {
            res.status(404).json({
                msg: "Room not found",
            });
            return;
        }
        res.status(200).json(room.toObject());
    },
);

R.post(
    "/rooms",
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        const room = await Room.findOne({ title: req.body.title }).exec();

        if (room) {
            res.status(400).json({
                msg: "Room already exists",
            });
            return;
        }

        const doc = await (await Room.create(req.body)).save();
        res.status(201).json(doc.toObject());
    },
);

R.get(
    "/rooms",
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        const docs = await Room.find();

        res.status(200).json({
            results: docs.map(doc => doc.toObject()),
            count: docs.length,
        });
    },
);

export default R;
