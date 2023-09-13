import Logger from "@lib/logger";
import History from "@models/History";
import Room from "@models/Room";
import express, { Request, Response } from "express";

const R = express();

R.patch(
    "/rooms/:roomId",
    async (req: Request, res: Response): Promise<void> => {
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
        res.status(200).json(doc);
    },
);

R.get("/rooms/:roomId", async (req: Request, res: Response): Promise<void> => {
    Logger.info({ method: "GET", url: req.originalUrl });
    const room = await Room.findOne({ _id: req.params.roomId }).exec();
    if (!room) {
        res.status(404).json({
            msg: "Room not found",
        });
        return;
    }

    res.status(200).json(room);
});

R.post("/rooms", async (req: Request, res: Response): Promise<void> => {
    const room = await Room.findOne({ title: req.body.title }).exec();

    if (room) {
        res.status(400).json({
            msg: "Room already exists",
        });
        return;
    }

    const doc = (await Room.create(req.body)).save();
    res.status(201).json(doc);
});

R.get("/rooms", async (req: Request, res: Response): Promise<void> => {
    const docs = await Room.find();

    res.status(200).json({
        results: docs,
        count: docs.length,
    });
});

export default R;
