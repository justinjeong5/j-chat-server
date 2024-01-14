import Logger from "@lib/logger";
import mongoose, { Mongoose } from "mongoose";

const initDatabase = async (): Promise<Mongoose> => {
    const connection = await mongoose.connect(process.env.MONGODB_URL, {
        dbName: process.env.MONGODB_DB_NAME,
    });
    Logger.done("successfully connected to mongodb");
    return connection;
};

export default initDatabase;
