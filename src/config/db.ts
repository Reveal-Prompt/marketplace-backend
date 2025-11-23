import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Use native promises
mongoose.Promise = Promise;

const MONGO_URI = process.env.MONGO_URI || 
  "mongodb+srv://revealprompt:revealprompt@prompt-dataset.w9tzabq.mongodb.net/?appName=Prompt-Dataset";


export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};

mongoose.connection.on("error", (error: Error) => {
  console.error("MongoDB runtime error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Reconnecting...");
});
