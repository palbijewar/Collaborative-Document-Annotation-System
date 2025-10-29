import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./db";

dotenv.config();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI as string;

(async () => {
  await connectDB(MONGO_URI);

  const server = http.createServer(app);

  server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})();
