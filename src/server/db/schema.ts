import { boolean, timestamp, text, date, primaryKey, integer, pgTable, uuid, index, varchar, bigint, pgEnum, numeric, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("veci_user", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

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
}, (account) => [
  {
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  },
]);

export const sessions = pgTable("veci_session", {
  userId: uuid("user_id").notNull().references(() => users.id),
  sessionToken: text("sessionToken").primaryKey(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("veci_verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (verificationToken) => [
  {
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  },
]);

export const authenticators = pgTable("veci_authenticator", {
  credentialID: text("credentialID").notNull().unique(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  providerAccountId: text("providerAccountId").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: integer("counter").notNull(),
  credentialDeviceType: text("credentialDeviceType").notNull(),
  credentialBackedUp: boolean("credentialBackedUp").notNull(),
  transports: text("transports"),
}, (authenticator) => [
  {
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  },
]);

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

export const mediaTypeEnum = pgEnum("veci_media_type", ["image", "pdf", "other"]);

export const mediaLibrary = pgTable("veci_media_library", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  type: mediaTypeEnum("type").notNull(),
  mimeType: varchar("mime_type", { length: 255 }).notNull(),
  sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
  width: integer("width"),
  height: integer("height"),
  aspectRatio: numeric("aspect_ratio", { precision: 8, scale: 5 }),
  location: varchar("location", { length: 64 }).notNull().default("not assigned"),
  checksumSha256: varchar("checksum_sha256", { length: 128 }),
  storageKey: varchar("storage_key", { length: 1024 }).notNull(),
  publicUrl: varchar("public_url", { length: 2083 }).notNull(),
  isPrivate: boolean("is_private").notNull().default(false),
  createdByUserId: uuid("created_by_user_id").references(() => users.id),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
}, (table) => {
  return {
    typeCreatedIdx: index("media_library_type_created_idx").on(table.type, table.createdAt),
    createdByIdx: index("media_library_created_by_idx").on(table.createdByUserId, table.createdAt),
    nameIdx: index("media_library_name_idx").on(table.name),
    slugUnique: uniqueIndex("media_library_slug_unique").on(table.slug),
  };
});

export const otps = pgTable("veci_otp", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  channel: text("channel", { enum: ["email", "phone"] }).notNull(),
  code: text("code").notNull(),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("veci_otp_user_id_idx").on(table.userId),
]);

export const notificationKind = pgEnum("veci_notification_kind", [
  "system",
  "identity_verified",
  "comment_received",
  "comment_approved",
  "comment_rejected",
  "comment_reply",
  "chat_message",
  "request_response",
  "job_application",
  "job_application_accepted",
  "job_updated",
]);

export const notifications = pgTable("veci_notifications", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  kind: notificationKind("kind").notNull().default("system"),
  title: varchar("title", { length: 160 }).notNull(),
  body: text("body"),
  href: varchar("href", { length: 512 }),
  readAt: timestamp("read_at", { withTimezone: true }),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("veci_notifications_user_created_idx").on(table.userId, table.createdAt),
  index("veci_notifications_unread_idx").on(table.userId, table.readAt),
]);

export const commentStatus = pgEnum("veci_comment_status", ["pendiente", "aprobado", "oculto"]);

export const comments = pgTable("veci_comments", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  // NOTE: plain uuid, no FK yet. Add the reference when veci_help_requests exists:
  //   ALTER TABLE veci_comments ADD CONSTRAINT veci_comments_request_id_fkey
  //     FOREIGN KEY (request_id) REFERENCES veci_help_requests (id) ON DELETE CASCADE;
  requestId: uuid("request_id").notNull(),
  authorId: uuid("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id"),
  content: text("content").notNull(),
  status: commentStatus("status").notNull().default("pendiente"),
  isOfficial: boolean("is_official").notNull().default(false),
  moderatedByUserId: uuid("moderated_by_user_id").references(() => users.id, { onDelete: "set null" }),
  moderatedAt: timestamp("moderated_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
}, (table) => [
  index("veci_comments_request_created_idx").on(table.requestId, table.createdAt),
  index("veci_comments_status_idx").on(table.status),
  index("veci_comments_author_id_idx").on(table.authorId),
]);

export const conversations = pgTable("veci_conversations", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  // NOTE: plain uuid, no FK yet. Add when veci_help_requests exists:
  //   ALTER TABLE veci_conversations ADD CONSTRAINT veci_conversations_request_id_fkey
  //     FOREIGN KEY (request_id) REFERENCES veci_help_requests (id) ON DELETE SET NULL;
  requestId: uuid("request_id"),
  subject: varchar("subject", { length: 160 }),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
}, (table) => [
  index("veci_conversations_last_message_idx").on(table.lastMessageAt),
]);

export const conversationParticipants = pgTable("veci_conversation_participants", {
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lastReadAt: timestamp("last_read_at", { withTimezone: true }),
  joinedAt: timestamp("joined_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  primaryKey({ columns: [table.conversationId, table.userId] }),
  index("veci_conversation_participants_user_idx").on(table.userId),
  index("veci_conversation_participants_user_unread_idx").on(table.userId, table.lastReadAt),
]);

export const chatMessages = pgTable("veci_chat_messages", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("veci_chat_messages_conversation_created_idx").on(table.conversationId, table.createdAt),
]);

export const rateLimitBuckets = pgTable("veci_rate_limit", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
});

export type NewMediaLibrary = typeof mediaLibrary.$inferInsert;
export type NewNotification = typeof notifications.$inferInsert;
export type NewComment = typeof comments.$inferInsert;
export type NewConversation = typeof conversations.$inferInsert;
export type NewChatMessage = typeof chatMessages.$inferInsert;
