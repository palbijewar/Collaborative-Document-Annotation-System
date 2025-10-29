import { Schema, model, Types } from "mongoose";

export type DocType = "TEXT" | "PDF";

const DocumentSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["TEXT", "PDF"], required: true },
    linearText: { type: String, required: true },
    fileId: { type: Schema.Types.ObjectId, default: null },
    createdBy: { type: Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

DocumentSchema.index({ createdAt: -1 });

export const Document = model("Document", DocumentSchema);
