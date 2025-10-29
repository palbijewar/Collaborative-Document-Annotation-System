import { Schema, model, Types } from "mongoose";

const AnnotationSchema = new Schema(
  {
    documentId: { type: Types.ObjectId, ref: "Document", required: true, index: true },
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    quote: { type: String, required: true },
    quoteHash: { type: String, required: true, index: true },
    comment: { type: String, required: true },
    pageHint: { type: Number, default: null },
  },
  { timestamps: true }
);
 
AnnotationSchema.index({ documentId: 1, userId: 1, start: 1, end: 1 }, { unique: true });

AnnotationSchema.index({ documentId: 1, start: 1, end: 1 });

export const Annotation = model("Annotation", AnnotationSchema);
