import { TUser } from "types/user.type";

export type TMessage = {
    id?: string;
    roomId: string;
    writer: TUser;

    type: TMessageType;
    content: string;
    image: string;

    stars: Array<object>;
    likes: Array<object>;
    comments: Array<object>;

    createdAt: Date;
    updatedAt: Date;
};

export type TMessageType = "plain" | "joinRoom" | "leaveRoom";
