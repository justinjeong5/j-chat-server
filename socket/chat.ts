/* eslint-disable no-underscore-dangle */
import Message from "@models/Message";
import Room from "@models/Room";
import { Server } from "socket.io";

export function submitMessage(io: Server) {
    io.on("submitMessage", async (data: any) => {
        const room = await Room.findOne({ _id: data.roomId }).exec();
        if (!room) {
            io.emit("SocketError", "존재하지 않는 대화방입니다.");
        }
        const message = await (
            await (await Message.create(data)).save()
        ).populate("writer");

        await Room.findOneAndUpdate(
            { _id: room._id },
            { $push: { dialog: message._id } },
        );

        io.emit("returnMessage", { chat: message });
    });
}

export default function registerChatSocket(io: Server) {
    submitMessage(io);
}
