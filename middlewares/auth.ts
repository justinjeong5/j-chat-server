import { verifyToken } from "@lib/api/jsonWebToken";
import User from "@models/User";
import { NextFunction, Request, Response } from "express";
import { notFound, userNotAuthenticated } from "lib/exception/error";

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
            .populate("likes")
            .populate("comments")
            .populate("dialog")
            .populate("stars")
            .exec();

        if (!user) {
            next(notFound());
            return;
        }

        const tokenExpired = new Date(decodedToken.exp * 1000);
        if (tokenExpired < new Date()) {
            next(userNotAuthenticated());
            return;
        }

        Object.assign(req, { user: user.toJSON() });
        next(null);
    } catch (error) {
        next(userNotAuthenticated());
    }
};

export default authMiddleware;
