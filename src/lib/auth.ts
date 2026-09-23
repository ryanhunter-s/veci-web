import NextAuth from "next-auth";
import { findUserByCredentials } from "@/lib/users";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
// import { CustomDrizzleAdapter } from "@/lib/customDrizzleAdapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: CustomDrizzleAdapter(),
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
      return true;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.neighborhood = (user as { neighborhood?: string }).neighborhood;
        token.address = (user as { address?: string }).address;
        token.phoneNumber = (user as { phoneNumber?: string }).phoneNumber;
        token.isEmailVerified = (user as { isEmailVerified?: boolean }).isEmailVerified;
        token.phoneVerified = (user as { phoneVerified?: boolean }).phoneVerified;
        token.identityVerified = (user as { identityVerified?: boolean }).identityVerified;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.neighborhood = token.neighborhood as string | undefined;
        session.user.address = token.address as string | undefined;
        session.user.phoneNumber = token.phoneNumber as string | undefined;
        session.user.isEmailVerified = token.isEmailVerified as boolean | undefined;
        session.user.phoneVerified = token.phoneVerified as boolean | undefined;
        session.user.identityVerified = token.identityVerified as boolean | undefined;
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