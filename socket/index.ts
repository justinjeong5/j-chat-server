import origin from "@lib/api/cors";
import Logger from "@lib/logger";
import registerChatSocket from "@socket/chat";
import { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

export default function initSocket(app: Application): Server {
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin,
            credentials: true,
        },
    });
    io.on("connection", client => {
        registerChatSocket(client);
    });

    const port = process.env.SOCKET_PORT || 3006;
    server.listen(port);
    Logger.done("successfully loaded socket.io");
    return io;
}
