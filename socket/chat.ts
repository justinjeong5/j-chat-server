/* eslint-disable no-underscore-dangle */
import Message from "@models/Message";
import Room from "@models/Room";
import { Server, Socket } from "socket.io";

export function submitMessage(io: Server, client: Socket) {
    client.on("submitMessage", async (data: any) => {
        console.log("submitMessage", data);
        const { id, ...msg } = data;
        const room = await Room.findById(data.roomId).exec();
        if (!room) {
            io.emit("SocketError", "존재하지 않는 대화방입니다.");
        }
        const message = await (
            await (await Message.create(msg)).save()
        ).populate("writer");

        await Room.findByIdAndUpdate(room._id, {
            $push: { dialog: message._id },
        });

        io.to(data.roomId).emit("returnMessage", { chat: message });
    });
}

export default function registerChatSocket(io: Server, socket: Socket) {
    submitMessage(io, socket);
}
