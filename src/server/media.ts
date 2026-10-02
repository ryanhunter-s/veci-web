export const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

export function inferMimeFromFilename(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".avif")) return "image/avif";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".pdf")) return "application/pdf";
  return "application/octet-stream";
}

export function fileTypeFromMime(mime: string): "image" | "pdf" | "other" {
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("image/")) return "image";
  return "other";
}

export function getUploadThingPublicUrlFromFileInput(file: { ufsUrl?: string | null; key?: string | null } | null | undefined): string {
  if (!file) return "";
  if (typeof file.ufsUrl === "string" && file.ufsUrl.length > 0) return file.ufsUrl;
  if (file.key) return `https://utfs.io/f/${file.key}`;
  return "";
}

export function slugifyFileName(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return `${Date.now()}-${base}`.slice(0, 255);
}
