import { NextResponse, NextRequest } from "next/server";
import { verifyIdentitySchema } from "@/lib/schemas";
import { verifyIdentity } from "@/lib/users";

const MAX_DOC_SIZE_BYTES = 3 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = verifyIdentitySchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json({ message: firstError?.message ?? "Invalid data" }, { status: 400 });
  }

  if (parsed.data.docContent.length > MAX_DOC_SIZE_BYTES) {
    return NextResponse.json({ message: "The document photo must be under 3 MB" }, { status: 400 });
  }

  const ok = verifyIdentity(parsed.data.id, {
    type: parsed.data.docType,
    number: parsed.data.docNumber,
    fileName: parsed.data.fileName,
  });
  if (!ok) {
    return NextResponse.json(
      { message: "User not found. Please start registration again." },
      { status: 404 },
    );
  }

  return NextResponse.json({ message: "Identity document received and marked as verified (simulated)." });
}