import mongoose from "mongoose";

let isConnected = false; // variable to check if mongoose is connected

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true); // to prevent unknown field query

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");
  if (isConnected) return console.log("Already connected to MongoDB");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
