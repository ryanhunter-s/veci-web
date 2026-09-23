import { boolean, timestamp, text, primaryKey, integer, pgTable, uuid } from "drizzle-orm/pg-core"
 
export const users = pgTable("veci_user", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})
 
export const accounts = pgTable("veci_account", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => [{
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId]
  })}
])
 
export const sessions = pgTable("veci_session", {
  userId: uuid("user_id").notNull().references(() => users.id),
  sessionToken: text("sessionToken").primaryKey(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable("veci_verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (verificationToken) => [{
  compositePk: primaryKey({
    columns: [verificationToken.identifier, verificationToken.token]
  })}
])
 
export const authenticators = pgTable("veci_authenticator", {
  credentialID: text("credentialID").notNull().unique(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  providerAccountId: text("providerAccountId").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: integer("counter").notNull(),
  credentialDeviceType: text("credentialDeviceType").notNull(),
  credentialBackedUp: boolean("credentialBackedUp").notNull(),
  transports: text("transports"),
}, (authenticator) => [{
  compositePK: primaryKey({
    columns: [authenticator.userId, authenticator.credentialID]
  })}
])