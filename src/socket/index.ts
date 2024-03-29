import cors from "@lib/api/cors";
import Logger from "@lib/logger";
import registerChatSocket from "@socket/chat";
import registerRoomSocket from "@socket/room";
import registerUserSocket from "@socket/user";
import { Application } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

export default function initSocket(app: Application): Server {
    const server = createServer(app);
    const io: Server = new Server(server, {
        cors,
    });
    io.on("connection", (client: Socket) => {
        registerChatSocket(io, client);
        registerRoomSocket(io, client);
        registerUserSocket(io, client);
    });

    const port = process.env.SOCKET_PORT || 3006;
    server.listen(port);
    Logger.done("successfully loaded socket.io");
    return io;
}
