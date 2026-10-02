import NextAuth from "next-auth";
import { findUserByCredentials } from "@/lib/users";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { CustomDrizzleAdapter } from "@/lib/customDrizzleAdapter";
import { db } from "@/server/db";
import { profiles, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: CustomDrizzleAdapter(),
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials, _request) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          return null;
        }

        const user = findUserByCredentials(email, password);
        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          neighborhood: user.neighborhood,
          address: user.address,
          phoneNumber: user.phoneNumber,
          isEmailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          identityVerified: user.identityVerified,
        };
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {        
        return true;
      }

      return true;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phoneNumber = user.phoneNumber;
      }

      const tokenUserId = typeof token.id === "string" ? token.id : undefined;

      if (tokenUserId) {
        // Re-read verification flags on every call so a step completed mid-session
        // (email, phone, identity) is reflected without forcing a new sign in.
        const usersRes = await db
          .select({
            id: users.id,
            emailVerified: users.emailVerified,
          })
          .from(users)
          .where(eq(users.id, tokenUserId))
          .limit(1);

        const profile = await db
          .select({
            phoneVerified: profiles.phoneVerified,
            identityVerified: profiles.identityVerified,
          })
          .from(profiles)
          .where(eq(profiles.userId, tokenUserId))
          .limit(1);

        token.isEmailVerified = usersRes[0]?.emailVerified != null;
        token.hasProfile = profile.length > 0;
        token.phoneVerified = profile[0]?.phoneVerified === true;
        token.identityVerified = profile[0]?.identityVerified === true;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.phoneNumber = token.phoneNumber as string;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
        session.user.phoneVerified = token.phoneVerified as boolean;
        session.user.identityVerified = token.identityVerified as boolean;
        session.user.hasProfile = token.hasProfile as boolean;
      }
      return session;
    },
  },
  pages: {
    error: "/auth/login",
    signIn: "/auth/login",
    verifyRequest: "/auth/verify",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 1,
  },
  trustHost: true,
});