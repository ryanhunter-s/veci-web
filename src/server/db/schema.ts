import {
  boolean,
  timestamp,
  text,
  date,
  primaryKey,
  integer,
  pgTable,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("veci_user", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable("veci_account", 
  {
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
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable("veci_session", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  sessionToken: text("sessionToken").primaryKey(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("veci_verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const authenticators = pgTable("veci_authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);

export const profiles = pgTable("veci_profile", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  phoneNumber: text("phoneNumber").notNull(),
  gender: text("gender", { enum: ["male", "female", "other"] }).notNull(),
  dateOfBirth: date("dateOfBirth", { mode: "string" }),
  address: text("address"),
  city: text("city"),
  zip: text("zip"),
  neighborhood: text("neighborhood"),
  passwordHash: text("passwordHash"),
  phoneVerified: boolean("phoneVerified").notNull().default(false),
  identityVerified: boolean("identityVerified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
});

export const identityDocuments = pgTable("veci_identity_document",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type", { enum: ["dpi", "passport"] }).notNull(),
    number: text("number").notNull(),
    fileName: text("fileName").notNull(),
    storageUrl: text("storageUrl"),
    status: text("status", { enum: ["pendiente", "aprobado", "rechazado"] }).notNull().default("pendiente"),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => [
    {
      userIdIdx: index("veci_identity_document_user_id_idx").on(table.userId),
    },
  ],
);

export const otps = pgTable("veci_otp",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    channel: text("channel", { enum: ["email", "phone"] }).notNull(),
    code: text("code").notNull(),
    attempts: integer("attempts").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => [
    {
      userIdIdx: index("veci_otp_user_id_idx").on(table.userId),
    },
  ],
);