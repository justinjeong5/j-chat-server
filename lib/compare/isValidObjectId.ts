import mongoose from "mongoose";

const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

export default isValidObjectId;
