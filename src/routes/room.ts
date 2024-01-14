/* eslint-disable no-underscore-dangle */
import isFalsy from "@lib/compare/isFalsy";
import isValidObjectId from "@lib/compare/isValidObjectId";
import auth from "@middlewares/auth";
import History from "@models/History";
import Message from "@models/Message";
import Room from "@models/Room";
import User from "@models/User";
import express, { NextFunction, Response } from "express";
import {
    alreadyExist,
    notFound,
    parameterInvalid,
    parameterRequired,
} from "lib/exception/error";
import { IAuthRequest } from "types/response.type";

const R = express();

R.post(
    "/rooms/:roomId/dialog",
    auth,
    async (
        req: IAuthRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        if (isFalsy(req.params.roomId)) {
            next(parameterRequired("roomId"));
            return;
        }

        if (!isValidObjectId(req.params.roomId)) {
            next(parameterInvalid("roomId"));
            return;
        }

        const room = await Room.findById(req.params.roomId).exec();
        if (!room) {
            next(notFound("존재하지 않는 대화방입니다."));
            return;
        }

        const message = await (
            await Message.create({
                writer: req.body.writer,
                content: req.body.content,
                roomId: req.params.roomId,
            })
        ).save();

        await Room.findByIdAndUpdate(room._id, {
            $push: { dialog: message._id },
        });
        await User.findByIdAndUpdate(req.body.writer, {
            $push: { dialog: message._id },
        });

        const doc = await Room.findById(room._id)
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

R.post(
    "/rooms/:roomId/users",
    auth,
    async (
        req: IAuthRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        if (isFalsy(req.params.roomId)) {
            next(parameterRequired("roomId"));
            return;
        }

        if (!isValidObjectId(req.params.roomId)) {
            next(parameterInvalid("roomId"));
            return;
        }

        const room = await Room.findById(req.params.roomId).exec();
        if (!room) {
            next(notFound("존재하지 않는 대화방입니다."));
            return;
        }
        await Room.findByIdAndUpdate(room._id, {
            $push: { users: req.body.users },
        });
        await User.findByIdAndUpdate(req.body.users, {
            $push: { room: room._id },
        });
        const doc = await Room.findById(room._id)
            .populate("users")
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
    "/rooms/:roomId/users",
    auth,
    async (
        req: IAuthRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        if (isFalsy(req.params.roomId)) {
            next(parameterRequired("roomId"));
            return;
        }

        if (!isValidObjectId(req.params.roomId)) {
            next(parameterInvalid("roomId"));
            return;
        }

        const room = await Room.findById(req.params.roomId).exec();
        if (!room) {
            next(notFound("존재하지 않는 대화방입니다."));
            return;
        }

        await User.findByIdAndUpdate(
            req.body.users,
            req.query.$pull
                ? { $pull: { room: room._id } }
                : { $push: { room: room._id } },
        );
        const roomData = req.query.$pull
            ? { $pull: req.body }
            : { $push: req.body };

        const doc = await Room.findByIdAndUpdate(room._id, roomData, {
            new: true,
        })
            .populate("users")
            .populate("dialog", {
                populate: {
                    path: "writer",
                },
            })
            .exec();

        await (
            await History.create({
                user_id: req.user._id,
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
    auth,
    async (
        req: IAuthRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        if (isFalsy(req.params.roomId)) {
            next(parameterRequired("roomId"));
            return;
        }

        if (!isValidObjectId(req.params.roomId)) {
            next(parameterInvalid("roomId"));
            return;
        }

        const room = await Room.findById(req.params.roomId)
            .populate("users")
            .populate({
                path: "dialog",
                populate: {
                    path: "writer",
                },
            })
            .exec();

        // TODO: 있는 방이지만 유저가 Join하지 않은 경우 핸들링하기

        if (!room) {
            next(notFound("존재하지 않는 대화방입니다."));
            return;
        }
        res.status(200).json(room.toJSON());
    },
);

R.post(
    "/rooms",
    auth,
    async (
        req: IAuthRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        const existingRoom = await Room.findOne({
            title: req.body.title,
        }).exec();

        if (existingRoom) {
            next(alreadyExist("이미 존재하는 대화방입니다."));
            return;
        }

        const { id, ...body } = req.body;
        const room = await (
            await Room.create({ ...body, users: [req.user._id] })
        ).save();

        await (
            await History.create({
                user_id: req.user._id,
                model: "Room",
                model_id: room._id,
                url: req.originalUrl,
                method: "POST",
                status: "201",
                response: JSON.stringify(room),
            })
        ).save();

        const doc = await Room.findById(room._id)
            .populate("users")
            .populate("dialog", {
                populate: {
                    path: "writer",
                },
            })
            .exec();

        res.status(201).json(doc.toJSON());
    },
);

R.get(
    "/rooms",
    auth,
    async (req: IAuthRequest, res: Response): Promise<void> => {
        const { page, pageSize, ...restQuery } = req.query;

        const pageNumber = parseInt(page as string, 10) || 0;
        const itemsPerPage = parseInt(pageSize as string, 10) || 10;
        const skip = pageNumber * itemsPerPage;

        const totalItems = await Room.countDocuments();
        const docs = await Room.find(restQuery)
            .skip(skip)
            .limit(itemsPerPage)
            .populate("users")
            .exec();

        res.status(200).json({
            results: docs.map(doc => doc.toJSON()),
            hasMore: totalItems > skip + itemsPerPage,
        });
    },
);

export default R;
