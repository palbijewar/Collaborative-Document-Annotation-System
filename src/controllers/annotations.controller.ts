import { Request, Response } from "express";
import { z } from "zod";
import { Annotation } from "../models/Annotation";
import { Document } from "../models/Document";
import { hashQuote } from "../utils/hashing";

const createSchema = z.object({
  documentId: z.string(),
  start: z.number().int().nonnegative(),
  end: z.number().int().gt(0),
  comment: z.string().min(1),
  pageHint: z.number().int().nullable().optional(),
});

export async function listAnnotations(req: Request, res: Response) {
  const { documentId, cursor, limit = 200 } = req.query as any;
  if (!documentId) return res.status(400).json({ error: "documentId required" });

  const q: any = { documentId };
  if (cursor) q._id = { $gt: cursor };

  const anns = await Annotation.find(q).sort({ _id: 1 }).limit(Number(limit));
  res.json({
    items: anns,
    nextCursor: anns.length ? anns[anns.length - 1]._id : null,
  });
}

export async function createAnnotation(req: any, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { documentId, start, end, comment, pageHint } = parsed.data;

  const doc = await Document.findById(documentId);
  if (!doc) return res.status(404).json({ error: "Document not found" });
  if (end > doc.linearText.length) return res.status(400).json({ error: "Invalid range" });

  const quote = doc.linearText.slice(start, end);
  const quoteHash = hashQuote(quote);

  try {
    const ann = await Annotation.create({
      documentId,
      userId: req.userId || "000000000000000000000000",
      start,
      end,
      quote,
      quoteHash,
      comment,
      pageHint: pageHint ?? null,
    });

    req.io.to(documentId).emit("annotation:new", ann);
    res.status(201).json(ann);
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Duplicate annotation for same range" });
    }
    throw err;
  }
}

export async function deleteAnnotation(req: any, res: Response) {
  const { id } = req.params;
  const ann = await Annotation.findById(id);
  if (!ann) return res.status(404).json({ error: "Annotation not found" });

  if (String(ann.userId) !== (req.userId || "000000000000000000000000")) {
    return res.status(403).json({ error: "Not authorized" });
  }

  await ann.deleteOne();
  req.io.to(String(ann.documentId)).emit("annotation:deleted", { _id: id });
  res.json({ success: true });
}
