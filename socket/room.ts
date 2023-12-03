/* eslint-disable no-underscore-dangle */
import History from "@models/History";
import Message from "@models/Message";
import Room from "@models/Room";
import User from "@models/User";
import { Server, Socket } from "socket.io";
import { TJoinRoom, TLeaveRoom } from "types/room.type";

export function joinRoom(io: Server, socket: Socket) {
    socket.on("joinRoom", async (data: TJoinRoom) => {
        const room = await Room.findById(data.roomId).exec();
        if (!room) {
            io.emit("SocketError", "존재하지 않는 대화방입니다.");
        }
        socket.join(data.roomId);

        const user = await User.findById(data.userId);
        const message = await (
            await (
                await Message.create({
                    roomId: room._id,
                    writer: user._id,
                    type: "joinRoom",
                })
            ).save()
        ).populate("writer");

        await Room.findByIdAndUpdate(room._id, {
            $push: { dialog: message._id },
        });
        io.to(data.roomId).emit("returnMessage", { chat: message });

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
    socket.on("leaveRoom", async (data: TLeaveRoom) => {
        const room = await Room.findById(data.roomId).exec();
        if (!room) {
            io.emit("SocketError", "존재하지 않는 대화방입니다.");
        }
        socket.leave(data.roomId);

        const user = await User.findById(data.userId);
        const message = await (
            await (
                await Message.create({
                    roomId: room._id,
                    writer: user._id,
                    type: "leaveRoom",
                })
            ).save()
        ).populate("writer");

        await Room.findByIdAndUpdate(room._id, {
            $push: { dialog: message._id },
        });
        io.to(data.roomId).emit("returnMessage", { chat: message });

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
