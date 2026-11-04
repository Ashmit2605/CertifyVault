CREATE TYPE "public"."invitation_delivery_status" AS ENUM('queued', 'sending', 'sent', 'retry', 'failed');--> statement-breakpoint
CREATE TABLE "holder_authenticator_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"challenge_hash" varchar(64) NOT NULL,
	"purpose" varchar(30) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "holder_authenticator_challenges_challenge_hash_unique" UNIQUE("challenge_hash")
);
--> statement-breakpoint
CREATE TABLE "invitation_outbox" (
	"id" serial PRIMARY KEY NOT NULL,
	"claim_id" integer NOT NULL,
	"recipient_email" varchar(320) NOT NULL,
	"status" "invitation_delivery_status" DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "holder_authenticator_challenges" ADD CONSTRAINT "holder_authenticator_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation_outbox" ADD CONSTRAINT "invitation_outbox_claim_id_credential_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."credential_claims"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "holder_authenticator_challenges_user_idx" ON "holder_authenticator_challenges" USING btree ("user_id","expires_at");--> statement-breakpoint
CREATE INDEX "invitation_outbox_status_attempt_idx" ON "invitation_outbox" USING btree ("status","next_attempt_at");