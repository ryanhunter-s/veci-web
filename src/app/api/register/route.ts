import { NextResponse, NextRequest } from "next/server";
import { registerSchemaApi } from "@/lib/schemas";
import { createUser } from "@/lib/users";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = registerSchemaApi.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json({ message: firstError?.message ?? "Invalid data" }, { status: 400 });
  }

  const user = createUser(parsed.data);
  if (!user) {
    return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
  }

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, neighborhood: user.neighborhood }, { status: 201 });
}