import mongoose from "mongoose";

const initDatabase = (): Promise<any> =>
    mongoose
        .connect(process.env.MONGODB_URL, {
            dbName: process.env.MONGODB_DB_NAME,
        })
        .then(() => {
            console.log("successfully connected to database");
        })
        .catch(error => {
            console.error(error);
        });

export default initDatabase;
