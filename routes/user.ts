/* eslint-disable no-underscore-dangle */
import isFalsy from "@lib/compare/isFalsy";
import isValidObjectId from "@lib/compare/isValidObjectId";
import auth from "@middlewares/auth";
import History from "@models/History";
import User from "@models/User";
import UserEventLog from "@models/UserEventLog";
import bcrypt from "bcryptjs";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
    alreadyExist,
    parameterInvalid,
    parameterRequired,
    userInvalidCredentials,
} from "lib/exception/error";

const R = express();

interface IRequestWithUser extends Request {
    user: {
        id: string;
        email: string;
    };
}

R.get(
    "/init",
    auth,
    async (req: IRequestWithUser, res: Response): Promise<void> => {
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

        const token = jwt.sign(
            { userId: userFound._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            },
        );

        res.cookie("j_chat_access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 3600,
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
    async (req: IRequestWithUser, res: Response): Promise<void> => {
        await (
            await UserEventLog.create({
                user_id: req.user.id,
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
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        await User.findOneAndUpdate({ id: user.id }, req.body);
        const doc = await User.findOne({ id: user.id });
        await (
            await History.create({
                user_id: user.id,
                model: "User",
                model_id: user.id,
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
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

R.get("/users", auth, async (req: Request, res: Response): Promise<void> => {
    const docs = await User.find();

    res.status(200).json({
        results: docs.map(doc => doc.toJSON()),
        count: docs.length,
    });
});

export default R;
