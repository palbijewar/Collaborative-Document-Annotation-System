import crypto from "crypto";

export function hashQuote(quote: string) {
  return crypto.createHash("sha256").update(quote).digest("hex");
}
