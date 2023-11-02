import { Request } from "express";
import { Server } from "socket.io";

export interface ISocketRequest extends Request {
    io: Server;
}

export interface IAuthRequest extends ISocketRequest {
    user: { _id: string; email: string };
}
