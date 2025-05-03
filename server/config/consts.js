import dotenv from "dotenv";

dotenv.config();

export const MAX_RETRIES = 5;
export const RETRY_DELAY_MS = 5000;
export const PORT = process.env.PORT || 3000;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
export const MONGO_URI = process.env.MONGO_URI || null;
