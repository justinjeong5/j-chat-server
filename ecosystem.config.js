module.exports = {
    apps: [
        {
            name: "app",
            script: "build/server/index.js",
            instances: "0",
            exec_mode: "cluster",
        },
    ],
};
