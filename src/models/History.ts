import mongoose from "mongoose";

const { Schema } = mongoose;

const historySchema = new Schema({
    user_id: Schema.Types.ObjectId,
    model: String,
    model_id: Schema.Types.ObjectId,
    path: String,
    method: String,
    status: String,
    response: String,
    created_at: { type: Date, default: Date.now },
});

const History = mongoose.model("History", historySchema);
// eslint-disable-next-line no-console
History.watch().on("change", data => console.log(new Date(), data));

export default History;
