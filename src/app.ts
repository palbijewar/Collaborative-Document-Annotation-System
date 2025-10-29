import express from "express";
import cors from "cors";
import { json } from "express";

const app = express();

app.use(cors());
app.use(json({ limit: "5mb" }));


export default app;
