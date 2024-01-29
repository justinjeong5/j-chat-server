module.exports = {
    apps: [
        {
            name: "JChatServer",
            script: "ts-node",
            args: "--project ./tsconfig.json ./build/src/server/index.js --watch --env production",
            watch: true,
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
