import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

import { auth } from "@/lib/auth";
import { verifyIdentitySchema } from "@/lib/schemas";
import { db } from "@/server/db";
import { mediaLibrary, profiles } from "@/server/db/schema";
import { fileTypeFromMime, inferMimeFromFilename, slugifyFileName } from "@/server/media";

const MAX_DOC_SIZE_BYTES = 3 * 1024 * 1024;

const ALLOWED_DOC_MIME = new Set(["image/png", "image/jpeg", "image/webp", "image/avif"]);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "You must log in to verify your identity." }, { status: 401 });
    }

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json({ message: "The request body is invalid." }, { status: 400 });
    }

    const parsed = verifyIdentitySchema.safeParse({
      docType: form.get("docType"),
      docNumber: form.get("docNumber"),
    });

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
    }

    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ message: "Please upload a photo of your document." }, { status: 400 });
    }

    if (file.size > MAX_DOC_SIZE_BYTES) {
      return NextResponse.json({ message: "The document photo must be under 3 MB" }, { status: 400 });
    }

    const mime = file.type || inferMimeFromFilename(file.name);

    if (!ALLOWED_DOC_MIME.has(mime)) {
      return NextResponse.json({ message: "Only JPG, PNG, WEBP or AVIF images are accepted." }, { status: 400 });
    }

    const { docType, docNumber } = parsed.data;

    const utapi = new UTApi();
    const result = await utapi.uploadFiles(file);

    if (result.error || !result.data) {
      console.error("UploadThing upload failed:", result.error);
      return NextResponse.json({ message: "We could not store your document. Please try again." }, { status: 502 });
    }

    const uploaded = result.data;
    const fileKey = uploaded.key;
    const publicUrl = uploaded.ufsUrl || `https://utfs.io/f/${fileKey}`;

    try {
      await utapi.updateACL(fileKey, "private");
    } catch (error) {
      console.error("Could not mark identity document as private:", error);
    }

    const [inserted] = await db
      .insert(mediaLibrary)
      .values({
        name: file.name,
        slug: slugifyFileName(file.name),
        type: fileTypeFromMime(mime),
        mimeType: mime,
        sizeBytes: file.size,
        storageKey: fileKey,
        publicUrl,
        isPrivate: true,
        location: "identity verification",
        createdByUserId: userId,
        metadata: {
          purpose: "identity_verification",
          docType,
          docNumber,
          verifiedAt: new Date().toISOString(),
        },
      })
      .returning({ id: mediaLibrary.id });

    if (!inserted) {
      return NextResponse.json({ message: "We could not save your document. Please try again." }, { status: 500 });
    }

    const updated = await db
      .update(profiles)
      .set({ identityVerified: true })
      .where(eq(profiles.userId, userId))
      .returning({ id: profiles.id });

    if (!updated.length) {
      return NextResponse.json({ message: "We could not update your profile. Please start registration again." }, { status: 404 });
    }

    return NextResponse.json({ message: "Your identity has been verified.", mediaId: inserted.id }, { status: 200 });
  } catch (error) {
    console.error("Error verifying identity:", error);
    return NextResponse.json({ message: "An error occurred while verifying your identity." }, { status: 500 });
  }
}
