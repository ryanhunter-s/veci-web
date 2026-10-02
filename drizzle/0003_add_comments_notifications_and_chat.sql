CREATE TYPE "public"."veci_comment_status" AS ENUM('pendiente', 'aprobado', 'oculto');--> statement-breakpoint
CREATE TYPE "public"."veci_notification_kind" AS ENUM('system', 'identity_verified', 'comment_received', 'comment_approved', 'comment_rejected', 'comment_reply', 'chat_message', 'request_response', 'job_application', 'job_application_accepted', 'job_updated');--> statement-breakpoint
CREATE TABLE "veci_chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "veci_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"parent_id" uuid,
	"content" text NOT NULL,
	"status" "veci_comment_status" DEFAULT 'pendiente' NOT NULL,
	"is_official" boolean DEFAULT false NOT NULL,
	"moderated_by_user_id" uuid,
	"moderated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "veci_conversation_participants" (
	"conversation_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"last_read_at" timestamp with time zone,
	"joined_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "veci_conversation_participants_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "veci_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"subject" varchar(160),
	"last_message_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "veci_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"actor_user_id" uuid,
	"kind" "veci_notification_kind" DEFAULT 'system' NOT NULL,
	"title" varchar(160) NOT NULL,
	"body" text,
	"href" varchar(512),
	"read_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "veci_chat_messages" ADD CONSTRAINT "veci_chat_messages_conversation_id_veci_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."veci_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veci_chat_messages" ADD CONSTRAINT "veci_chat_messages_sender_id_veci_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."veci_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veci_comments" ADD CONSTRAINT "veci_comments_author_id_veci_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."veci_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veci_comments" ADD CONSTRAINT "veci_comments_moderated_by_user_id_veci_user_id_fk" FOREIGN KEY ("moderated_by_user_id") REFERENCES "public"."veci_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veci_conversation_participants" ADD CONSTRAINT "veci_conversation_participants_conversation_id_veci_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."veci_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veci_conversation_participants" ADD CONSTRAINT "veci_conversation_participants_user_id_veci_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."veci_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veci_notifications" ADD CONSTRAINT "veci_notifications_user_id_veci_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."veci_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veci_notifications" ADD CONSTRAINT "veci_notifications_actor_user_id_veci_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."veci_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "veci_chat_messages_conversation_created_idx" ON "veci_chat_messages" USING btree ("conversation_id","created_at");--> statement-breakpoint
CREATE INDEX "veci_comments_request_created_idx" ON "veci_comments" USING btree ("request_id","created_at");--> statement-breakpoint
CREATE INDEX "veci_comments_status_idx" ON "veci_comments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "veci_comments_author_id_idx" ON "veci_comments" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "veci_conversation_participants_user_idx" ON "veci_conversation_participants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "veci_conversation_participants_user_unread_idx" ON "veci_conversation_participants" USING btree ("user_id","last_read_at");--> statement-breakpoint
CREATE INDEX "veci_conversations_last_message_idx" ON "veci_conversations" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "veci_notifications_user_created_idx" ON "veci_notifications" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "veci_notifications_unread_idx" ON "veci_notifications" USING btree ("user_id","read_at");--> statement-breakpoint
CREATE INDEX "veci_otp_user_id_idx" ON "veci_otp" USING btree ("user_id");