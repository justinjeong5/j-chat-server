import mongoose from "mongoose";

import isValidObjectId from "./isValidObjectId";

describe("isValidObjectId function", () => {
    it("should return true for valid ObjectIds", () => {
        const validId = new mongoose.Types.ObjectId().toHexString();
        expect(isValidObjectId(validId)).toBe(true);
    });

    it("should return false for invalid ObjectIds", () => {
        const invalidId = "123";
        expect(isValidObjectId(invalidId)).toBe(false);
    });
});
