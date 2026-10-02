import { auth } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { mediaLibrary, type NewMediaLibrary } from "@/server/db/schema";
import { db } from "@/server/db";
import {
  ALLOWED_MIME,
  fileTypeFromMime,
  getUploadThingPublicUrlFromFileInput,
  inferMimeFromFilename,
  slugifyFileName,
} from "@/server/media";

export type UploadThingFileLike = {
  ufsUrl?: string | null;
  key?: string | null;
  name?: string;
};

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB" },
  })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user?.id) throw new UploadThingError("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const mime = file.type || inferMimeFromFilename(file.name);

      if (!ALLOWED_MIME.has(mime)) {
        throw new UploadThingError("Unsupported media type");
      }

      const publicUrl = getUploadThingPublicUrlFromFileInput(file);

      const row: NewMediaLibrary = {
        name: file.name,
        slug: slugifyFileName(file.name),
        type: fileTypeFromMime(mime),
        mimeType: mime,
        sizeBytes: file.size ?? 0,
        storageKey: file.key || publicUrl,
        publicUrl,
        isPrivate: false,
        location: "media library",
        createdByUserId: metadata.userId,
        width: null,
        height: null,
        aspectRatio: null,
        checksumSha256: null,
        metadata: {},
      } as unknown as NewMediaLibrary;

      await db.insert(mediaLibrary).values(row);

      return { uploadedBy: metadata.userId, storageKey: file.key, url: publicUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
