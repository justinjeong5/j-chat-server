import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    clearMocks: true,
    coverageProvider: "v8",
    modulePaths: ["<rootDir>/"],
    moduleDirectories: ["node_modules"],
    moduleFileExtensions: ["js", "mjs", "cjs", "ts"],
    roots: ["<rootDir>"],
};

export default config;
