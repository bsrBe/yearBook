import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({path:'../config/.env'});

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI
 
    if (!uri) {
      throw new Error("MongoDB URI not found in environment variables.");
    }
    await mongoose.connect(uri, {});
    console.log("Connected to MongoDb successfully");
  } catch (err) {
    console.error("Error Connecting to the database", err);
    // process.exit(1); // Exit the process if connection fails
  }
};

export default connectDB;
