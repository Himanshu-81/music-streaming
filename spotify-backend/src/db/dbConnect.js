import mongoose from "mongoose";

export const connectDB = async () => {
  try {
  } catch (error) {
    console.log("Error connecting to DB", error);
    process.exit(1);
  }
};
