import { Router } from "express";
import {
  createTextDocument,
  createPdfDocument,
  listDocuments,
  getDocument,
} from "../controllers/documents.controller";
import dotenv from "dotenv";
import { upload } from "../utils/gridfs";

dotenv.config();
const router = Router();

router.post("/text", createTextDocument);
router.post("/pdf", upload.single("file"), createPdfDocument);
router.get("/", listDocuments);
router.get("/:id", getDocument);

export default router;
