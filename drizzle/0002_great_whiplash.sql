CREATE TYPE "public"."harmony_sms2_media_type" AS ENUM('image', 'pdf', 'other');--> statement-breakpoint
CREATE TABLE "veci_media_library" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" "harmony_sms2_media_type" NOT NULL,
	"mime_type" varchar(255) NOT NULL,
	"size_bytes" bigint NOT NULL,
	"width" integer,
	"height" integer,
	"aspect_ratio" numeric(8, 5),
	"location" varchar(64) DEFAULT 'not assigned' NOT NULL,
	"checksum_sha256" varchar(128),
	"storage_key" varchar(1024) NOT NULL,
	"public_url" varchar(2083) NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"created_by_user_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DROP TABLE "veci_identity_document" CASCADE;--> statement-breakpoint
ALTER TABLE "veci_media_library" ADD CONSTRAINT "veci_media_library_created_by_user_id_veci_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."veci_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_library_type_created_idx" ON "veci_media_library" USING btree ("type","created_at");--> statement-breakpoint
CREATE INDEX "media_library_created_by_idx" ON "veci_media_library" USING btree ("created_by_user_id","created_at");--> statement-breakpoint
CREATE INDEX "media_library_name_idx" ON "veci_media_library" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "media_library_slug_unique" ON "veci_media_library" USING btree ("slug");