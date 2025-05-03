import mongoose from "mongoose";
import { MAX_RETRIES, RETRY_DELAY_MS, MONGO_URI } from "./consts.js";

export const connectToDB = async (attempt = 1) => {
  try {
    if (!MONGO_URI)
      throw new Error(
        "⚠️  No MONGO_URI provided in consts.js file. MongoDB connection will not be attempted."
      );

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error(`❌ MongoDB connection attempt ${attempt} failed:`, err.message);

    // if (attempt < MAX_RETRIES) {
    //   console.log(`🔁 Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
    //   setTimeout(() => connectToDB(attempt + 1), RETRY_DELAY_MS);
    // } else {
    //   console.error("❌ Failed to connect to MongoDB after maximum retries. Exiting...");
    //   process.exit(1);
    // }
  }
};
