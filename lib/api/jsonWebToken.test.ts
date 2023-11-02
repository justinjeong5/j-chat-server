import jwt from "jsonwebtoken";

import { generateToken, verifyToken } from "./jsonWebToken";

describe("lib/api/jsonWebToken.ts", () => {
    let originalJwtSecret: string;

    beforeAll(() => {
        originalJwtSecret = process.env.JWT_SECRET;
        process.env.JWT_SECRET = "test-secret";
    });

    afterAll(() => {
        process.env.JWT_SECRET = originalJwtSecret;
    });

    it("should correctly generate and verify a token", () => {
        const payload = { userId: "test-user" };
        const token = generateToken(payload);

        expect(typeof token).toBe("string");

        const decoded = verifyToken(token);
        expect(decoded).toMatchObject(payload);
    });

    it("should throw an error for an invalid token", () => {
        const invalidToken = jwt.sign({ foo: "bar" }, "wrong-secret");

        expect(() => verifyToken(invalidToken)).toThrow("Invalid token");
    });
});
