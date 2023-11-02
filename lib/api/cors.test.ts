import origin from "./cors";

describe("origin", () => {
    it("should match localhost URLs", () => {
        [
            "http://localhost/example",
            "http://localhost:3000",
            "http://localhost:8080/login",
        ].forEach(url => {
            expect(origin.some(regex => regex.test(url))).toBeTruthy();
        });
    });

    it("should match Vercel URLs", () => {
        [
            "https://j-chat-example-justinjeong5.vercel.app/",
            "https://j-chat-test-justinjeong5.vercel.app/about",
            "https://j-chat-1234-justinjeong5.vercel.app/contact",
        ].forEach(url => {
            expect(origin.some(regex => regex.test(url))).toBeTruthy();
        });
    });

    it("should not match other URLs", () => {
        [
            "https://example.com",
            "http://www.google.com",
            "https://justinjeong5.vercel.app",
        ].forEach(url => {
            expect(origin.some(regex => regex.test(url))).toBeFalsy();
        });
    });
});
