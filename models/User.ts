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

const User = mongoose.model("User", userSchema);

export default User;
