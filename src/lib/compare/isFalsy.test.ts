import isFalsy from "./isFalsy"; // 파일 경로는 실제 경로에 맞게 수정해야 합니다.

describe("isFalsy function", () => {
    it("should return true for 'false'", () => {
        expect(isFalsy("false")).toBe(true);
    });

    it("should return true for 'null'", () => {
        expect(isFalsy("null")).toBe(true);
    });

    it("should return true for 'undefined'", () => {
        expect(isFalsy("undefined")).toBe(true);
    });

    it("should return true for an empty string", () => {
        expect(isFalsy("")).toBe(true);
    });

    it("should return false for other values", () => {
        expect(isFalsy("true")).toBe(false);
        expect(isFalsy(null)).toBe(false);
        expect(isFalsy(undefined)).toBe(false);
        expect(isFalsy(0)).toBe(false);
    });
});
