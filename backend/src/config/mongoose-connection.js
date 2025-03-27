import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connection success");
    }
    catch (error) {
        console.log("Error in DB connection: ", error.message);
        process.exit(1);
    }
}