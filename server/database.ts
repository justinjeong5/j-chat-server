import mongoose, { Mongoose } from "mongoose";

const initDatabase = async (): Promise<Mongoose> => {
    const connect = await mongoose.connect(process.env.MONGODB_URL, {
        dbName: process.env.MONGODB_DB_NAME,
    });
    console.log("successfully connected to database");
    return connect;
};

export default initDatabase;
