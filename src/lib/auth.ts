import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/schemas";
import { findUserByCredentials } from "@/lib/users";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = findUserByCredentials(parsed.data.email, parsed.data.password);
        if (!user) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
};