import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI); // Debugging

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/ChatAppDB`);
        console.log("MongoDB connection success");
    } catch (error) {
        console.log("Error in DB connection:", error.message);
        process.exit(1);
    }
};
