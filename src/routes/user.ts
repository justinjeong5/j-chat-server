/* eslint-disable no-underscore-dangle */
import { generateToken } from "@lib/api/jsonWebToken";
import isFalsy from "@lib/compare/isFalsy";
import isValidObjectId from "@lib/compare/isValidObjectId";
import Logger from "@liblogger";
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
/* eslint-disable import/no-extraneous-dependencies */
import NodeCache from "node-cache";
import nodemailer from "nodemailer";
import { IAuthRequest } from "types/response.type";

const R = express();
const authCodeCache = new NodeCache({ stdTTL: 5 * 60 });

R.get(
    "/init",
    auth,
    async (req: IAuthRequest, res: Response): Promise<void> => {
        await User.findByIdAndUpdate(req.user._id, {
            last_login: Date.now(),
        }).exec();
        res.json(req.user);
    },
);

R.post(
    "/auth/email",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (isFalsy(req.body.email)) {
            next(parameterRequired("email"));
            return;
        }
        const authCode = Math.floor(100000 + Math.random() * 900000).toString();
        authCodeCache.set(req.body.email, authCode);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SERVICE_EMAIL_ID,
                pass: process.env.SERVICE_EMAIL_PW,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.SERVICE_EMAIL_ID,
            to: req.body.email,
            subject: "[JChat] 회원가입 인증 코드",
            text: `인증 코드는 ${authCode} 입니다.`,
        });
        Logger.text(info);

        res.json({ message: "인증 코드가 발송되었습니다." });
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

        const savedCode = authCodeCache.get(req.body.email);
        if (savedCode === req.body.code) {
            authCodeCache.del(req.body.email);
        } else {
            next(userInvalidCredentials("인증 코드가 일치하지 않습니다."));
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
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            next(userInvalidCredentials("로그인 정보를 다시 확인해 주세요."));
            return;
        }

        const isMatchedPassword = await bcrypt.compare(
            req.body.password,
            user.password,
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

        const token = generateToken({ userId: user._id.toString() });

        res.cookie("j_chat_access_token", token, {
            domain: process.env.DOMAIN,
            httpOnly: false,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 3600 * 1000,
        });

        await User.findByIdAndUpdate(user._id, {
            last_login: Date.now(),
        }).exec();

        await (
            await UserEventLog.create({
                user_id: user._id,
                email: user.email,
                action: "login",
            })
        ).save();

        res.json({ token, user: user.toJSON() });
    },
);

R.post(
    "/logout",
    auth,
    async (req: IAuthRequest, res: Response): Promise<void> => {
        await User.findByIdAndUpdate(req.user._id, {
            $set: { active: false },
        }).exec();

        await (
            await UserEventLog.create({
                user_id: req.user._id,
                email: req.user.email,
                action: "logout",
            })
        ).save();

        res.cookie("j_chat_access_token", null, {
            domain: process.env.DOMAIN,
            httpOnly: false,
            sameSite: "none",
            secure: true,
            maxAge: -1,
        });
        res.json({ message: "로그아웃 되었습니다." });
    },
);

R.get(
    "/users",
    auth,
    async (req: IAuthRequest, res: Response): Promise<void> => {
        const { page, pageSize, ...restQuery } = req.query;

        const pageNumber = parseInt(page as string, 10) || 0;
        const itemsPerPage = parseInt(pageSize as string, 10) || 10;
        const skip = pageNumber * itemsPerPage;

        const totalItems = await User.countDocuments();
        const docs = await User.find(restQuery)
            .skip(skip)
            .limit(itemsPerPage)
            .exec();

        res.status(200).json({
            results: docs
                .map(doc => doc.toJSON())
                .map(
                    ({
                        password,
                        old_password,
                        rooms,
                        stars,
                        dialog,
                        likes,
                        comments,
                        ...rest
                    }) => ({
                        ...rest,
                    }),
                ),
            count: docs.length,
            hasMore: totalItems > skip + itemsPerPage,
        });
    },
);

R.patch(
    "/:userId",
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

        const user = await User.findById(req.params.userId).exec();
        if (!user) {
            next(userInvalidCredentials("로그인 정보를 다시 확인해 주세요."));
            return;
        }

        const isMatchedPassword = await bcrypt.compare(
            req.body.password,
            user.password,
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

        const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
            new: true,
        }).exec();

        await (
            await History.create({
                user_id: user._id,
                model: "User",
                model_id: user._id,
                url: req.originalUrl,
                method: "PATCH",
                // status: "200",
                response: JSON.stringify(updatedUser),
            })
        ).save();
        await (
            await UserEventLog.create({
                user_id: user._id,
                email: updatedUser.email,
                action: "edit_info",
            })
        ).save();
        res.status(200).json(updatedUser.toJSON());
    },
);

R.get(
    "/:userId",
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

        const user = await User.findById(req.params.userId)
            .populate("rooms")
            .populate("likes")
            .populate("comments")
            .populate("dialog")
            .populate("stars")
            .exec();

        if (!user) {
            next(userInvalidCredentials("로그인 정보를 다시 확인해 주세요."));
            return;
        }

        res.status(200).json(user.toJSON());
    },
);

export default R;
