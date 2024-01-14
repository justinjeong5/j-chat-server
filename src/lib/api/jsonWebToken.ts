import jwt from "jsonwebtoken";

export function generateToken(payload: object): string {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    return token;
}

export function verifyToken(token: string): jwt.JwtPayload {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
            userId: string;
            exp: number;
        };
        return decoded as jwt.JwtPayload;
    } catch (err) {
        throw new Error("Invalid token");
    }
}
