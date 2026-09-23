import { NextResponse, NextRequest } from "next/server";
import { registerApiSchema } from "@/lib/schemas";
import { createPendingUser, toPublicUser } from "@/lib/users";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.captcha !== true) {
    return NextResponse.json({ message: "Please confirm you are not a robot" }, { status: 400 });
  }

  const parsed = registerApiSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json({ message: firstError?.message ?? "Invalid data" }, { status: 400 });
  }

  const user = createPendingUser(parsed.data);
  if (!user) {
    return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
  }

  return NextResponse.json(toPublicUser(user), { status: 201 });
}