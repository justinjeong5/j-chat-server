import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
    roomId: Schema.Types.ObjectId,
    writer: { type: Schema.Types.ObjectId, ref: "User" },

    type: { type: String, default: "plain" },
    content: { type: String, default: "" },
    image: { type: String, default: "" },

    stars: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "User" }],

    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
// eslint-disable-next-line no-console
Message.watch().on("change", data => console.log(new Date(), data));

export default Message;
