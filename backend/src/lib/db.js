import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const { MONGODB_URI } = process.env;
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }

        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // 1 ststus code means error, 0 means success
    }
};