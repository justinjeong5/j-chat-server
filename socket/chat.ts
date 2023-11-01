import { Socket } from "socket.io";

export default function registerChatSocket(client: Socket) {
    client.on("submitMessage", async (data: string) => {
        console.log("submitMessage", data);
    });
}
