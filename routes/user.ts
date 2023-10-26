/* eslint-disable no-underscore-dangle */
import isFalsy from "@lib/compare/isFalsy";
import isValidObjectId from "@lib/compare/isValidObjectId";
import { generateToken } from "@lib/jsonWebToken";
import auth from "@middlewares/auth";
import History from "@models/History";
import User from "@models/User";
import UserEventLog from "@models/UserEventLog";
import bcrypt from "bcryptjs";
import express, { NextFunction, Request, Response } from "express";
import {
    alreadyExist,
    parameterInvalid,
    parameterRequired,
    userInvalidCredentials,
} from "lib/exception/error";
import { IAuthRequest } from "types/response.type";

const R = express();

R.get(
    "/init",
    auth,
    async (req: IAuthRequest, res: Response): Promise<void> => {
        res.json(req.user);
    },
);

R.post(
    "/signup",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            next(alreadyExist("이미 존재하는 이메일입니다."));
            return;
        }

        const doc = await (await User.create(req.body)).save();
        await (
            await UserEventLog.create({
                user_id: doc._id,
                email: doc.email,
                action: "signup",
            })
        ).save();
        res.json(doc.toJSON());
    },
);

R.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userFound = await User.findOne({ email: req.body.email });

        if (!userFound) {
            next(userInvalidCredentials("로그인 정보를 다시 확인해 주세요."));
            return;
        }

        const isMatchedPassword = await bcrypt.compare(
            req.body.password,
            userFound.password,
        );

        if (!isMatchedPassword) {
            await (
                await UserEventLog.create({
                    user_id: null,
                    email: req.body.email,
                    action: "login_failed",
                })
            ).save();

            next(userInvalidCredentials("로그인 정보를 다시 확인해 주세요."));
            return;
        }

        const token = generateToken({ userId: userFound._id.toString() });
        const domain =
            process.env.NODE_ENV !== "production"
                ? "localhost"
                : "j-chat-server-ca2746f5cceb.herokuapp.com";

        res.cookie("j_chat_access_token", token, {
            domain,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 3600 * 1000,
        });

        await (
            await UserEventLog.create({
                user_id: userFound._id,
                email: userFound.email,
                action: "login",
            })
        ).save();

        res.json({ token, user: userFound.toJSON() });
    },
);

R.post(
    "/logout",
    auth,
    async (req: IAuthRequest, res: Response): Promise<void> => {
        await (
            await UserEventLog.create({
                user_id: req.user._id,
                email: req.user.email,
                action: "logout",
            })
        ).save();
        res.clearCookie("j_chat_access_token");
        res.json({ message: "로그아웃 되었습니다." });
    },
);

R.patch(
    "/users/:userId",
    auth,
    async (
        req: IAuthRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        if (isFalsy(req.params.userId)) {
            next(parameterRequired("userId"));
            return;
        }

        if (!isValidObjectId(req.params.userId)) {
            next(parameterInvalid("userId"));
            return;
        }

        const user = await User.findOne({ _id: req.params.userId }).exec();
        if (!user) {
            next(userInvalidCredentials("로그인 정보를 다시 확인해 주세요."));
            return;
        }
        await User.findOneAndUpdate({ _id: user._id }, req.body);
        const doc = await User.findOne({ _id: user._id });
        await (
            await History.create({
                user_id: user._id,
                model: "User",
                model_id: user._id,
                url: req.originalUrl,
                method: "PATCH",
                // status: "200",
                response: JSON.stringify(doc),
            })
        ).save();
        await (
            await UserEventLog.create({
                user_id: doc._id,
                email: doc.email,
                action: "edit_info",
            })
        ).save();
        res.status(200).json(doc.toJSON());
    },
);

R.get(
    "/users/:userId",
    auth,
    async (
        req: IAuthRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        if (isFalsy(req.params.userId)) {
            next(parameterRequired("userId"));
            return;
        }

        if (!isValidObjectId(req.params.userId)) {
            next(parameterInvalid("userId"));
            return;
        }

        const user = await User.findOne({ _id: req.params.userId }).exec();
        if (!user) {
            next(userInvalidCredentials("로그인 정보를 다시 확인해 주세요."));
            return;
        }

        res.status(200).json(user.toJSON());
    },
);

R.get(
    "/users",
    auth,
    async (req: IAuthRequest, res: Response): Promise<void> => {
        const docs = await User.find();

        res.status(200).json({
            results: docs.map(doc => doc.toJSON()),
            count: docs.length,
        });
    },
);

export default R;
