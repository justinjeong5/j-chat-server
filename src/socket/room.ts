/* eslint-disable no-underscore-dangle */
import History from "@models/History";
import Message from "@models/Message";
import Room from "@models/Room";
import { Server, Socket } from "socket.io";
import {
    TEnterRoom,
    TExitRoom,
    TJoinRoom,
    TLeaveRoom,
    TRoom,
} from "types/room.type";

export function joinRoom(io: Server, client: Socket) {
    client.on("enterRoom", async (data: TEnterRoom) => {
        const room = await Room.findById(data.roomId).exec();
        if (!room) {
            io.emit("SocketError", "존재하지 않는 대화방입니다.");
        }
        client.join(data.roomId);
    });
    client.on("joinRoom", async (data: TJoinRoom) => {
        const room = await Room.findById(data.roomId).exec();
        if (!room) {
            io.emit("SocketError", "존재하지 않는 대화방입니다.");
        }
        client.join(data.roomId);

        const message = await (
            await (
                await Message.create({
                    roomId: room._id,
                    writer: data.userId,
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
                user_id: data.userId,
                model: "Room",
                model_id: room._id,
                method: "SOCKET",
                response: "joinRoom",
            })
        ).save();
    });
}
export function leaveRoom(io: Server, client: Socket) {
    client.on("exitRoom", async (data: TExitRoom) => {
        const room = await Room.findById(data.roomId).exec();
        if (!room) {
            client.emit("SocketError", "존재하지 않는 대화방입니다.");
        }
        client.leave(data.roomId);
    });
    client.on("leaveRoom", async (data: TLeaveRoom) => {
        const room = await Room.findById(data.roomId).exec();
        if (!room) {
            client.emit("SocketError", "존재하지 않는 대화방입니다.");
        }
        client.leave(data.roomId);

        const message = await (
            await (
                await Message.create({
                    roomId: room._id,
                    writer: data.userId,
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
                user_id: data.userId,
                model: "Room",
                model_id: room._id,
                method: "SOCKET",
                response: "leaveRoom",
            })
        ).save();
    });
}

export function roomPost(io: Server, client: Socket) {
    client.on("roomPosting", async (data: TRoom) => {
        io.emit("roomPosted", data);
    });
}

export default function registerRoomSocket(io: Server, client: Socket) {
    joinRoom(io, client);
    leaveRoom(io, client);
    roomPost(io, client);
}
