import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!token.hasProfile && pathname !== "/createProfile") {
    const url = new URL("/createProfile", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (!token.isEmailVerified && pathname !== "/emailVerified") {
    const url = new URL("/emailVerified", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (!token.phoneVerified && pathname !== "/phoneVerified") {
    const url = new URL("/phoneVerified", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (!token.identityVerified && pathname !== "/identityVerified") {
    const url = new URL("/identityVerified", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/createProfile",
    "/emailVerified",
    "/phoneVerified",
    "/identityVerified",
  ],
};