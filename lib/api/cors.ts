const origin = [
    /^http:\/\/localhost/,
    /^https:\/\/j-chat-[a-z0-9-]*justinjeong5.vercel.app/,
];

export default {
    origin,
    credentials: true,
};

export { origin };
