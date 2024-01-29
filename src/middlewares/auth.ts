/* eslint-disable no-underscore-dangle */
import { generateToken, verifyToken } from "@lib/api/jsonWebToken";
import User from "@models/User";
import { NextFunction, Request, Response } from "express";
import {
    notFound,
    unknownError,
    userAuthenticationExpired,
    userNotAuthenticated,
} from "lib/exception/error";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response> => {
    const token = req.cookies.j_chat_access_token;
    if (!token) {
        next(userNotAuthenticated());
        return;
    }

    try {
        const decodedToken = verifyToken(token);

        const user = await User.findById(decodedToken.userId)
            .populate("rooms")
            .populate("likes")
            .populate("dialog")
            .populate("comments")
            .populate("stars")
            .exec();

        if (!user) {
            next(notFound());
            return;
        }

        const tokenExpired = new Date(decodedToken.exp * 1000);
        if (tokenExpired < new Date()) {
            next(userAuthenticationExpired());
            return;
        }

        const updatedToken = generateToken({ userId: user._id.toString() });
        const domain =
            process.env.NODE_ENV !== "production"
                ? "localhost"
                : process.env.DOMAIN;

        res.cookie("j_chat_access_token", updatedToken, {
            domain,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 3600 * 1000,
        });

        Object.assign(req, { user: user.toJSON() });
        next(null);
    } catch (error) {
        console.error(error);
        next(unknownError());
    }
};

export default authMiddleware;
