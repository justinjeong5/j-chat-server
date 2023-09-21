/* eslint-disable no-underscore-dangle */
import isFalsy from "@lib/compare/isFalsy";
import isValidObjectId from "@lib/compare/isValidObjectId";
import authMiddleware from "@middlewares/auth";
import History from "@models/History";
import Message from "@models/Message";
import Room from "@models/Room";
import express, { NextFunction, Request, Response } from "express";
import {
    alreadyExist,
    notFound,
    parameterInvalid,
    parameterRequired,
} from "lib/exception/error";

const R = express();

R.post(
    "/rooms/:roomId/dialog",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (isFalsy(req.params.roomId)) {
            next(parameterRequired("roomId"));
            return;
        }

        if (!isValidObjectId(req.params.roomId)) {
            next(parameterInvalid("roomId"));
            return;
        }

        const room = await Room.findOne({ _id: req.params.roomId }).exec();
        if (!room) {
            next(notFound("존재하지 않는 대화방입니다."));
            return;
        }

        const message = await (
            await Message.create({
                writer: req.body.writer,
                content: req.body.content,
            })
        ).save();

        await Room.findOneAndUpdate(
            { _id: room._id },
            { $push: { dialog: message._id } },
        );
        const doc = await Room.findOne({ _id: room._id })
            .populate({
                path: "dialog",
                populate: {
                    path: "writer",
                },
            })
            .exec();
        res.status(200).json(doc.toJSON());
    },
);

R.patch(
    "/rooms/:roomId",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (isFalsy(req.params.roomId)) {
            next(parameterRequired("roomId"));
            return;
        }

        if (!isValidObjectId(req.params.roomId)) {
            next(parameterInvalid("roomId"));
            return;
        }

        const room = await Room.findOne({ _id: req.params.roomId }).exec();
        if (!room) {
            next(notFound("존재하지 않는 대화방입니다."));
            return;
        }
        await Room.findOneAndUpdate({ _id: room._id }, req.body);
        const doc = await Room.findOne({ _id: room._id });
        await (
            await History.create({
                // user_id: user.id,
                model: "Room",
                model_id: room._id,
                url: req.originalUrl,
                method: "PATCH",
                status: "200",
                response: JSON.stringify(doc),
            })
        ).save();
        res.status(200).json(doc.toJSON());
    },
);

R.get(
    "/rooms/:roomId",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (isFalsy(req.params.roomId)) {
            next(parameterRequired("roomId"));
            return;
        }

        if (!isValidObjectId(req.params.roomId)) {
            next(parameterInvalid("roomId"));
            return;
        }

        const room = await Room.findOne({ _id: req.params.roomId })
            .populate({
                path: "dialog",
                populate: {
                    path: "writer",
                },
            })
            .exec();

        if (!room) {
            next(notFound("존재하지 않는 대화방입니다."));
            return;
        }
        console.log(room);
        res.status(200).json(room.toJSON());
    },
);

R.post(
    "/rooms",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const room = await Room.findOne({ title: req.body.title }).exec();

        if (room) {
            next(alreadyExist("이미 존재하는 대화방입니다."));
            return;
        }

        const doc = await (await Room.create(req.body)).save();
        res.status(201).json(doc.toJSON());
    },
);

R.get(
    "/rooms",
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        const docs = await Room.find();

        res.status(200).json({
            results: docs.map(doc => doc.toJSON()),
            count: docs.length,
        });
    },
);

export default R;
