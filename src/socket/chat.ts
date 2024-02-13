/* eslint-disable no-underscore-dangle */
import Message from "@models/Message";
import Room from "@models/Room";
import User from "@models/User";
import { Server, Socket } from "socket.io";

export function submitMessage(io: Server, client: Socket) {
    client.on("submitMessage", async (data: any) => {
        const room = await Room.findById(data.roomId).exec();
        if (!room) {
            client.emit("SocketError", "존재하지 않는 대화방입니다.");
        }

        const message = await (
            await (await Message.create(data)).save()
        ).populate("writer");

        await Room.findByIdAndUpdate(room._id, {
            $push: { dialog: message._id },
        });
        await User.findByIdAndUpdate(message.writer._id, {
            $push: { dialog: message._id },
        });

        io.to(data.roomId).emit("returnMessage", { chat: message });
    });
}

export function typingMessage(io: Server, client: Socket) {
    client.on("typingMessage", async (data: any) => {
        io.to(data.roomId).emit("typingMessage", {
            user: {
                id: data.user.id,
                username: data.user.username,
            },
        });
    });
    client.on("typingDone", async (data: any) => {
        io.to(data.roomId).emit("typingDone", {
            user: {
                id: data.user.id,
                username: data.user.username,
            },
        });
    });
}

export default function registerChatSocket(io: Server, socket: Socket) {
    submitMessage(io, socket);
    typingMessage(io, socket);
}
