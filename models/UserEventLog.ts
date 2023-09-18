import mongoose from "mongoose";

const { Schema } = mongoose;

const userEventLogSchema = new Schema({
    id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId,
    email: String,

    action: String,
    created_at: { type: Date, default: Date.now },
});

const UserEventLog = mongoose.model("UserEventLog", userEventLogSchema);
UserEventLog.watch().on("change", data => console.log(new Date(), data));

export default UserEventLog;
