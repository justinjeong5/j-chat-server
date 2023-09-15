import User from "@models/User";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response> => {
    const token = req.cookies.j_chat_access_token;
    if (!token) {
        res.status(403).json({ error: "Token not provided" });
        return;
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {
            userId: string;
            exp: number;
        };

        const user = await User.findById(decodedToken.userId);
        if (!user) {
            res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
            return;
        }

        const tokenExpired = new Date(decodedToken.exp * 1000);
        if (tokenExpired < new Date()) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        Object.assign(req, { user: user.toObject() });
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid JWT" });
    }
};

export default authMiddleware;
