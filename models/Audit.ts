import mongoose from "mongoose";

const { Schema } = mongoose;

const auditSchema = new Schema({
    id: Schema.Types.ObjectId,

    title: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    type: { type: String, default: "public" },
    starred: { type: Boolean, default: false },

    users: { type: Array, default: [] },
    dialog: { type: Array, default: [] },

    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
});

const Audit = mongoose.model("Audit", auditSchema);
Audit.watch().on("change", data => console.log(new Date(), data));

export default Audit;
