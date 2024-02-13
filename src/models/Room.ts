import mongoose from "mongoose";

const { Schema } = mongoose;

const roomSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    type: { type: String, default: "public" },
    starred: { type: Boolean, default: false },

    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dialog: [{ type: Schema.Types.ObjectId, ref: "Message" }],

    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
});

const Room = mongoose.model("Room", roomSchema);
// eslint-disable-next-line no-console
Room.watch().on("change", data => console.log(new Date(), data));

export default Room;
