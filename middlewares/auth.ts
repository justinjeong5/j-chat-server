import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(403).json({ error: "Token not provided" });
        return;
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {
            userId: string;
        };
        Object.assign(req, { userId: decodedToken.userId });
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid JWT" });
    }
};

export default authMiddleware;
