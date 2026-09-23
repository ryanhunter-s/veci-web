import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    neighborhood?: string;
    address?: string;
    phoneNumber?: string;
    isEmailVerified?: boolean;
    phoneVerified?: boolean;
    identityVerified?: boolean;
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
    } & DefaultSession["user"];
  }
}