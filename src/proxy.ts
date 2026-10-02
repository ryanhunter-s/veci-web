import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  } else {
    if(token.hasProfile == false) {
      const loginUrl = new URL("/createProfile", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    if(token.isEmailVerified === false) {
      const loginUrl = new URL("/emailVerified", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    if(token.phoneVerified === false) {
      const loginUrl = new URL("/phoneVerified", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    if(token.identityVerified === false) {
      const loginUrl = new URL("/identityVerified", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};