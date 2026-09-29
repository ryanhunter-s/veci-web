CREATE TABLE "veci_account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "veci_authenticator" (
	"credentialID" text NOT NULL,
	"userId" uuid NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "veci_authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "veci_identity_document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"number" text NOT NULL,
	"fileName" text NOT NULL,
	"storageUrl" text,
	"status" text DEFAULT 'pendiente' NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "veci_otp" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"channel" text NOT NULL,
	"code" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "veci_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"phoneNumber" text NOT NULL,
	"gender" text NOT NULL,
	"dateOfBirth" date,
	"address" text,
	"city" text,
	"zip" text,
	"neighborhood" text,
	"passwordHash" text,
	"phoneVerified" boolean DEFAULT false NOT NULL,
	"identityVerified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "veci_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "veci_session" (
	"user_id" uuid NOT NULL,
	"sessionToken" text PRIMARY KEY NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "veci_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "veci_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "veci_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "veci_account" ADD CONSTRAINT "veci_account_user_id_veci_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."veci_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veci_authenticator" ADD CONSTRAINT "veci_authenticator_userId_veci_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."veci_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veci_identity_document" ADD CONSTRAINT "veci_identity_document_user_id_veci_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."veci_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veci_otp" ADD CONSTRAINT "veci_otp_user_id_veci_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."veci_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veci_profile" ADD CONSTRAINT "veci_profile_user_id_veci_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."veci_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veci_session" ADD CONSTRAINT "veci_session_user_id_veci_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."veci_user"("id") ON DELETE no action ON UPDATE no action;