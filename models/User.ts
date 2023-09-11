import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    avatar: String,
});

const User = mongoose.model("User", userSchema);

User.create([
    {
        username: "A",
        email: "a@gmail.com",
        password: "123456",
        avatar: "https://i.imgur.com/3xXWYUu.png",
    },
    {
        username: "B",
        email: "b@gmail.com",
        password: "123456",
        avatar: "https://i.imgur.com/3xXWYUu.png",
    },
    {
        username: "C",
        email: "c@gmail.com",
        password: "123456",
        avatar: "https://i.imgur.com/3xXWYUu.png",
    },
    {
        username: "D",
        email: "d@gmail.com",
        password: "123456",
        avatar: "https://i.imgur.com/3xXWYUu.png",
    },
]);

export default User;
