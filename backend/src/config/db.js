import mongoose from "mongoose";
import { env } from "./env.js";

let databaseConnected = false;

export async function connectToDatabase() {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
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
    console.warn(`MongoDB error: ${error.message}`);
    console.warn(
      "Start MongoDB locally on 127.0.0.1:27017 or set MONGODB_URI to a reachable instance.",
    );
  }
}

export function isDatabaseConnected() {
  return databaseConnected && mongoose.connection.readyState === 1;
}
