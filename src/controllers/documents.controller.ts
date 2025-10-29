import { Request, Response } from "express";
import { z } from "zod";
import { Document } from "../models/Document";
import { uploadToGridFS } from "../utils/gridfs";

const MONGO_URI = process.env.MONGO_URI as string;

const textDocSchema = z.object({
  title: z.string().min(1),
  linearText: z.string().min(1),
});

export async function createTextDocument(req: Request, res: Response) {
  const parsed = textDocSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  const { title, linearText } = parsed.data;
  const doc = await Document.create({ title, linearText, type: "TEXT" });
  res.status(201).json(doc);
}

export async function createPdfDocument(req: any, res: Response) {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { title, linearText } = req.body;
  if (!title || !linearText)
    return res.status(400).json({ error: "Title & text required" });

  try {
    const uploadResult: any = await uploadToGridFS(
      process.env.MONGO_URI!,
      req.file
    );
    console.log("✅ GridFS upload result:", uploadResult);

    const doc = await Document.create({
      title,
      type: "PDF",
      linearText,
      fileId: uploadResult._id,
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error("GridFS upload error:", err);
    res.status(500).json({ error: "File upload failed" });
  }
}

export async function listDocuments(req: Request, res: Response) {
  const docs = await Document.find({}).sort({ createdAt: -1 }).limit(50);
  res.json({ data: docs });
}

export async function getDocument(req: Request, res: Response) {
  const { id } = req.params;
  const doc = await Document.findById(id);
  if (!doc) return res.status(404).json({ error: "Document not found" });
  res.json(doc);
}
