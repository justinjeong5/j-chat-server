import User from "@models/User";
import { Server, Socket } from "socket.io";

export function userStatus(io: Server, client: Socket) {
    client.on("userLogin", async (data: any) => {
        await User.findByIdAndUpdate(data.id, {
            $set: { active: true },
        }).exec();
        io.emit("userLogin", { user: data.id });
    });
    client.on("userLogout", async (data: any) => {
        await User.findByIdAndUpdate(data.id, {
            $set: { active: false },
        }).exec();
        io.emit("userLogout", { user: data.id });
    });
}

export default function registerUserSocket(io: Server, socket: Socket) {
    userStatus(io, socket);
}
