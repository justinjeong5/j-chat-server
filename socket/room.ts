/* eslint-disable no-underscore-dangle */
import History from "@models/History";
import Room from "@models/Room";
import User from "@models/User";
import { Server, Socket } from "socket.io";

export function joinRoom(io: Server, socket: Socket) {
    socket.on("joinRoom", async (data: any) => {
        console.log("joinRoom", data);
        const room = await Room.findById(data.roomId).exec();
        console.log(room);
        if (!room) {
            io.emit("SocketError", "존재하지 않는 대화방입니다.");
        }
        socket.join(data.roomId);

        const user = await User.findById(data.userId);
        console.log(user);
        io.to(data.roomId).emit("returnRoom", { user, status: "join" });

        await (
            await History.create({
                user_id: user._id,
                model: "Room",
                model_id: room._id,
                method: "SOCKET",
                response: "joinRoom",
            })
        ).save();
    });
}
export function leaveRoom(io: Server, socket: Socket) {
    socket.on("leaveRoom", async (data: any) => {
        console.log("leaveRoom", data);
        const room = await Room.findById(data.roomId).exec();
        console.log(room);
        if (!room) {
            io.emit("SocketError", "존재하지 않는 대화방입니다.");
        }
        socket.leave(data.roomId);

        const user = await User.findById(data.userId);
        console.log(user);
        io.to(data.roomId).emit("returnRoom", { user, status: "leave" });

        await (
            await History.create({
                user_id: user._id,
                model: "Room",
                model_id: room._id,
                method: "SOCKET",
                response: "leaveRoom",
            })
        ).save();
    });
}

export default function registerRoomSocket(io: Server, socket: Socket) {
    joinRoom(io, socket);
    leaveRoom(io, socket);
}
