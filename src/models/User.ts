import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    password: String,
    old_password: String,

    role: { type: Array, default: ["common"] },

    email: { type: String, required: true, unique: true },
    username: { type: String, default: "" },
    description: { type: String, default: "" },
    avatar: { type: String, default: "" },

    rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    stars: [{ type: Schema.Types.ObjectId, ref: "Room" }],

    dialog: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Message" }],

    active: { type: Boolean, default: false },
    last_login: { type: Date, default: Date.now },
    login_stamp: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
});

userSchema.set("toJSON", {
    transform(_, ret: any): any {
        const copiedDoc = ret;

        delete copiedDoc.password;
        delete copiedDoc.old_password;
        delete copiedDoc.login_stamp;
        return copiedDoc;
    },
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
    const updatedUser = Object(this.getUpdate());
    if (!updatedUser.password) {
        next();
    }

    const updatedPassword = await bcrypt.hash(updatedUser.password, 10);
    this.set({ password: updatedPassword });
    this.set({ updated_at: Date.now() });
    next();
});

const User = mongoose.model("User", userSchema);
User.watch().on("change", data => console.log(new Date(), data));

export default User;
