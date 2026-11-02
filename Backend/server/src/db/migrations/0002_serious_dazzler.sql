CREATE TYPE "public"."blockchain_registration_status" AS ENUM('not_submitted', 'submitted', 'confirmed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."blockchain_revocation_status" AS ENUM('not_submitted', 'submitted', 'confirmed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."certificate_status" AS ENUM('pending_registration', 'issued', 'registration_failed', 'revocation_pending', 'revoked', 'expired');--> statement-breakpoint
CREATE TABLE "certificate_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor_id" integer,
	"certificate_row_id" integer,
	"action" varchar(100) NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "issuer_id" integer;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "certificate_type" varchar(40) DEFAULT 'custom' NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "title" varchar(255) DEFAULT 'Certificate' NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "grade" varchar(50);--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "issue_date" date;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "expiry_date" date;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "status" "certificate_status" DEFAULT 'registration_failed' NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "storage_key" text;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "file_mime_type" varchar(100);--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "file_size" integer;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "qr_token_version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "verification_url" text;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "blockchain_network" varchar(100);--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "contract_address" varchar(255);--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "blockchain_block_number" text;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "registration_status" "blockchain_registration_status" DEFAULT 'failed' NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "revocation_status" "blockchain_revocation_status" DEFAULT 'not_submitted' NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "revocation_reason" text;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "revoked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "certificate_audit_logs" ADD CONSTRAINT "certificate_audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate_audit_logs" ADD CONSTRAINT "certificate_audit_logs_certificate_row_id_certificates_id_fk" FOREIGN KEY ("certificate_row_id") REFERENCES "public"."certificates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_issuer_id_users_id_fk" FOREIGN KEY ("issuer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;