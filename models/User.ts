import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    id: Schema.Types.ObjectId,
    role: { type: Array, default: ["common"] },

    email: { type: String, required: true, unique: true },
    password: String,
    old_password: String,
    username: { type: String, default: "" },
    description: { type: String, default: "" },
    avatar: { type: String, default: "" },

    likes: { type: Array, default: [] },
    comments: { type: Array, default: [] },
    dialog: { type: Array, default: [] },
    stars: { type: Array, default: [] },

    last_login: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model("User", userSchema);
User.watch().on("change", data => console.log(new Date(), data));

export default User;
