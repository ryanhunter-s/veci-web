import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    neighborhood?: string;
    address?: string;
    phoneNumber?: string;
    isEmailVerified?: boolean;
    phoneVerified?: boolean;
    identityVerified?: boolean;
    hasProfile?: boolean;
    thumbnail?: string;
  }

  interface Session {
    user: {
      id: string;
      neighborhood?: string;
      address?: string;
      phoneNumber?: string;
      isEmailVerified?: boolean;
      phoneVerified?: boolean;
      identityVerified?: boolean;
      hasProfile?: boolean;
      thumbnail?: string;
    } & DefaultSession["user"];
  }
}