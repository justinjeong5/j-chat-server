import Logger from "@lib/logger";
import { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

export default function initSocket(app: Application): void {
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });
    io.on("connection", client => {
        console.log("Socket Connection", client.id);
        client.on("submitMessage", data => {
            console.log("Socket submitMessage", data);
            return io.emit("returnMessage", { chat: data });
        });
        client.on("hello", data => {
            console.log("Socket hello", data);
            return io.emit("world", { chat: data });
        });
    });

    server.listen(3006);
    Logger.done("successfully loaded socket.io");
}
