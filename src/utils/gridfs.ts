import multer from "multer";
import { GridFSBucket, MongoClient } from "mongodb";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config(); 

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error("❌ Missing MONGO_URI in .env file");
}

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export async function uploadToGridFS(MONGO_URI: string, file: Express.Multer.File) {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const db = client.db();
  const bucket = new GridFSBucket(db, { bucketName: "files" });
console.log({file});

  const uploadStream = bucket.openUploadStream(file.originalname, {
    contentType: file.mimetype,
  });

  const readable = Readable.from(file.buffer);
  readable.pipe(uploadStream);

  return new Promise<{ _id: any; filename: string }>((resolve, reject) => {
    const fileId = uploadStream.id;

    uploadStream.on("finish", () => {
      client.close();
      resolve({ _id: fileId, filename: file.originalname });
    });

    uploadStream.on("error", (err) => {
      client.close();
      reject(err);
    });
  });
}
