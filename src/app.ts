import express from "express";
import cors from "cors";
import { json } from "express";

const app = express();

app.use(cors());
app.use(json({ limit: "5mb" }));

app.get("/test-db", async (req, res) => {
  const docCount = await import("./models/Document").then(m => m.Document.countDocuments());
  res.json({ message: "DB connected!", docs: docCount });
});

export default app;
