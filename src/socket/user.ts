import User from "@models/User";
import { Server, Socket } from "socket.io";
import { TUser } from "types/user.type";

export function userLogin(io: Server, client: Socket) {
    client.on("emitLogin", async (data: TUser) => {
        await User.findByIdAndUpdate(data.id, {
            $set: { active: true },
        }).exec();
        io.emit("returnLogin", { user: data.id });
    });
}

export function userLogout(io: Server, client: Socket) {
    client.on("emitLogout", async (data: TUser) => {
        await User.findByIdAndUpdate(data.id, {
            $set: { active: false },
        }).exec();
        io.emit("returnLogout", { user: data.id });
    });
}

export default function registerUserSocket(io: Server, socket: Socket) {
    userLogin(io, socket);
    userLogout(io, socket);
}
