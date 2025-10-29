import { Router } from "express";
import {
  listAnnotations,
  createAnnotation,
  deleteAnnotation,
} from "../controllers/annotations.controller";

const router = Router();

router.get("/", listAnnotations);
router.post("/", createAnnotation);
router.delete("/:id", deleteAnnotation);

export default router;
