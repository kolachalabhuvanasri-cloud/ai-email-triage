import mongoose from "mongoose";
import { env } from "./env.js";

let databaseConnected = false;

export async function connectToDatabase() {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.mongoUri);
    databaseConnected = true;
    console.log("Connected to MongoDB.");
  } catch (error) {
    databaseConnected = false;

    if (env.mongoRequired) {
      throw error;
    }

    console.warn(
      "MongoDB connection failed. Falling back to in-memory email storage for this process.",
    );
    console.warn(error.message);
  }
}

export function isDatabaseConnected() {
  return databaseConnected && mongoose.connection.readyState === 1;
}
