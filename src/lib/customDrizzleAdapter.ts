import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import { users, accounts, sessions, verificationTokens } from "@/server/db/schema";
import { db } from "@/server/db";

export function CustomDrizzleAdapter(): Adapter {
  const baseAdapter = DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens
  }) as Adapter;

  return {
    ...baseAdapter,

    async createUser(profile) {
      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, profile?.email ?? ""),
      });

      if (existingUser) {
        return {
          id: existingUser.id,
          name: existingUser.name ?? "",
          email: existingUser.email ?? "",
          emailVerified: existingUser.emailVerified ?? null,
          image: existingUser.image ?? null,
        } satisfies AdapterUser;
      }

      const newUser = await baseAdapter?.createUser?.(profile);

      return {
        ...newUser,
      } as AdapterUser;
    },

    async linkAccount(account) {
      const existingAccount = await db.query.accounts.findFirst({
        where: (acc, { and, eq }) =>
          and(
            eq(acc.provider, account.provider),
            eq(acc.providerAccountId, account.providerAccountId),
          ),
      });

      if (!existingAccount) {
        const existingProviderForUser = await db.query.accounts.findFirst({
          where: (acc, { and, eq }) => and(eq(acc.userId, account.userId), eq(acc.provider, account.provider)),
          columns: {
            id: true,
            providerAccountId: true,
          },
        });

        if (
          existingProviderForUser &&
          existingProviderForUser.providerAccountId !== account.providerAccountId
        ) {
          console.error("Blocked linkAccount due to conflicting provider account on user", {
            userId: account.userId,
            provider: account.provider,
            existingProviderAccountId: existingProviderForUser.providerAccountId,
            incomingProviderAccountId: account.providerAccountId,
          });
          return;
        }

        await baseAdapter?.linkAccount?.(account);
      }
    },
  };
}
