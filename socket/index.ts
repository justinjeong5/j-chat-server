import Logger from "@lib/logger";
import { Application } from "express";
import http from "http";
import { Server } from "socket.io";

export default function initSocket(app: Application): void {
    const server = http.createServer(app);
    const io = new Server(server);
    io.on("connection", socket => {
        socket.on("submitMessage", data => {
            console.log(data);
            return io.emit("returnMessage", { chat: data });
        });
    });

    Logger.done("successfully loaded socket.io");
}
