import { TMessage } from "types/message.type";
import { TUser } from "types/user.type";

export type TRoom = {
    id: string;
    title: string;
    description: string;
    type: string;
    starred: boolean;
    createdAt: Date;
    updatedAt: Date;
    users: TUser[];
    dialog: Array<TMessage>;
};

export type TJoinRoom = { roomId: string; userId: string };
export type TLeaveRoom = { roomId: string; userId: string };
export type TEnterRoom = { roomId: string };
export type TExitRoom = { roomId: string };
