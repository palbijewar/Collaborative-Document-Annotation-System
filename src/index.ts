import http from "http";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import { attachSockets } from "./sockets";
import documentRoutes from "./routes/documents.routers";
import annotationRoutes from "./routes/annotations.routers";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI as string;

(async () => {
  await connectDB(MONGO_URI);

  const server = http.createServer(app);
  const io = attachSockets(server);

  app.use((req: any, _res, next) => {
    req.io = io;
    req.userId = "000000000000000000000000";
    next();
  });

  app.use("/api/documents", documentRoutes);
  app.use("/api/annotations", annotationRoutes);

  server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})();
