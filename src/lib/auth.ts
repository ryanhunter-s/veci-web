import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { CustomDrizzleAdapter } from "@/lib/customDrizzleAdapter";
import { db } from "@/server/db";
import { profiles, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit, ipKey } from "@/server/rateLimit";
import { loginSchema } from "@/lib/schemas";
import argon2 from "argon2";

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
      authorize: async (credentials, request) => {
        const ip = ipKey({ headers: request.headers });
        const limit = await rateLimit(`${ip}:login`, {
          limit: 10,
          windowMs: 15 * 60 * 1000,
        });
        if (!limit.ok) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        if (!credentials?.email || !credentials?.password) throw new Error("Invalid credentials.");

        const parseResult = loginSchema.safeParse(credentials);
        if (!parseResult.success) throw new Error("Invalid credentials.");

        const normalizedEmail = parseResult.data.email.trim().toLowerCase();
        const user = await db.query.users.findFirst({
          where: (user, { ilike }) => ilike(user.email, normalizedEmail),
          columns: {
            id: true,
            email: true,
            emailVerified: true,
          },
        });
        if (!user) throw new Error("Invalid credentials.");

        const profile = await db.query.profiles.findFirst({
          where: (profile, { eq }) => eq(profile.userId, user.id),
        });

        if (!profile?.passwordHash) {
          // Check if this email is authenticated with Google only
          const googleAccount = await db.query.accounts.findFirst({
            where: (a, { and, eq }) => and(eq(a.userId, user.id), eq(a.provider, "google")),
            columns: { id: true },
          });
          if (googleAccount) {
            throw new Error("GOOGLE_AUTH_ONLY");
          }
          throw new Error("NO_PASSWORD_ACCOUNT");
        }

        const isMatch = await argon2.verify(profile.passwordHash, parseResult.data.password);
        if (!isMatch) throw new Error("Invalid credentials.");

        return {
          id: user.id,
          name: profile.firstName,
          email: user.email,
          isEmailVerified: user.emailVerified !== null,
          phoneVerified: profile.phoneVerified,
          identityVerified: profile.identityVerified,
          hasProfile: true,
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