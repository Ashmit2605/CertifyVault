CREATE TYPE "public"."bulk_document_status" AS ENUM('queued', 'validated', 'issuing', 'issued', 'failed', 'manual_review');--> statement-breakpoint
CREATE TYPE "public"."bulk_import_status" AS ENUM('queued', 'processing', 'completed', 'completed_with_errors', 'failed');--> statement-breakpoint
CREATE TYPE "public"."credential_claim_status" AS ENUM('requested', 'approved', 'claimed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."credential_visibility" AS ENUM('public', 'unlisted', 'private');--> statement-breakpoint
CREATE TYPE "public"."pdf_download_policy" AS ENUM('private', 'link', 'public');--> statement-breakpoint
CREATE TABLE "bulk_import_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"row_number" integer NOT NULL,
	"status" "bulk_document_status" DEFAULT 'queued' NOT NULL,
	"input" jsonb NOT NULL,
	"certificate_row_id" integer,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bulk_import_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"issuer_id" integer NOT NULL,
	"idempotency_key" varchar(128) NOT NULL,
	"status" "bulk_import_status" DEFAULT 'queued' NOT NULL,
	"total_documents" integer DEFAULT 0 NOT NULL,
	"completed_documents" integer DEFAULT 0 NOT NULL,
	"failed_documents" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credential_claim_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"claim_id" integer NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"recipient_email" varchar(320) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "credential_claim_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "credential_claims" (
	"id" serial PRIMARY KEY NOT NULL,
	"certificate_row_id" integer NOT NULL,
	"recipient_id" integer,
	"holder_id" integer,
	"status" "credential_claim_status" DEFAULT 'requested' NOT NULL,
	"claim_method" varchar(40) NOT NULL,
	"evidence_category" varchar(100),
	"decision_reason" text,
	"reviewed_by" integer,
	"reviewed_at" timestamp with time zone,
	"claimed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credential_share_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"claim_id" integer NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"allow_pdf_download" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "credential_share_links_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "credential_sharing_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"claim_id" integer NOT NULL,
	"visibility" "credential_visibility" DEFAULT 'unlisted' NOT NULL,
	"pdf_download_policy" "pdf_download_policy" DEFAULT 'private' NOT NULL,
	"show_recipient_name" boolean DEFAULT false NOT NULL,
	"allow_structured_export" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "holder_authenticators" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"credential_id" text NOT NULL,
	"public_key" text NOT NULL,
	"counter" integer DEFAULT 0 NOT NULL,
	"transports" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"device_name" varchar(100),
	"last_used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "holder_authenticators_credential_id_unique" UNIQUE("credential_id")
);
--> statement-breakpoint
CREATE TABLE "recipient_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"issuer_id" integer NOT NULL,
	"recipient_name" varchar(255) NOT NULL,
	"institution_reference" varchar(255),
	"email" varchar(320),
	"email_verified_at" timestamp with time zone,
	"academic_details" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "structured_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"certificate_row_id" integer NOT NULL,
	"credential_json" jsonb NOT NULL,
	"credential_digest" varchar(64) NOT NULL,
	"proof_key_id" varchar(128) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "recipient_id" integer;--> statement-breakpoint
ALTER TABLE "bulk_import_documents" ADD CONSTRAINT "bulk_import_documents_job_id_bulk_import_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."bulk_import_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bulk_import_documents" ADD CONSTRAINT "bulk_import_documents_certificate_row_id_certificates_id_fk" FOREIGN KEY ("certificate_row_id") REFERENCES "public"."certificates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bulk_import_jobs" ADD CONSTRAINT "bulk_import_jobs_issuer_id_users_id_fk" FOREIGN KEY ("issuer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_claim_tokens" ADD CONSTRAINT "credential_claim_tokens_claim_id_credential_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."credential_claims"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_claims" ADD CONSTRAINT "credential_claims_certificate_row_id_certificates_id_fk" FOREIGN KEY ("certificate_row_id") REFERENCES "public"."certificates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_claims" ADD CONSTRAINT "credential_claims_recipient_id_recipient_records_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."recipient_records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_claims" ADD CONSTRAINT "credential_claims_holder_id_users_id_fk" FOREIGN KEY ("holder_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_claims" ADD CONSTRAINT "credential_claims_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_share_links" ADD CONSTRAINT "credential_share_links_claim_id_credential_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."credential_claims"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credential_sharing_settings" ADD CONSTRAINT "credential_sharing_settings_claim_id_credential_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."credential_claims"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holder_authenticators" ADD CONSTRAINT "holder_authenticators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipient_records" ADD CONSTRAINT "recipient_records_issuer_id_users_id_fk" FOREIGN KEY ("issuer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "structured_credentials" ADD CONSTRAINT "structured_credentials_certificate_row_id_certificates_id_fk" FOREIGN KEY ("certificate_row_id") REFERENCES "public"."certificates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bulk_import_documents_job_row_unique" ON "bulk_import_documents" USING btree ("job_id","row_number");--> statement-breakpoint
CREATE INDEX "bulk_import_documents_job_status_idx" ON "bulk_import_documents" USING btree ("job_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "bulk_import_jobs_issuer_idempotency_unique" ON "bulk_import_jobs" USING btree ("issuer_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "bulk_import_jobs_issuer_status_idx" ON "bulk_import_jobs" USING btree ("issuer_id","status");--> statement-breakpoint
CREATE INDEX "credential_claim_tokens_claim_idx" ON "credential_claim_tokens" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX "credential_claim_tokens_expiry_idx" ON "credential_claim_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "credential_claims_certificate_unique" ON "credential_claims" USING btree ("certificate_row_id");--> statement-breakpoint
CREATE INDEX "credential_claims_holder_idx" ON "credential_claims" USING btree ("holder_id","status");--> statement-breakpoint
CREATE INDEX "credential_share_links_claim_idx" ON "credential_share_links" USING btree ("claim_id");--> statement-breakpoint
CREATE UNIQUE INDEX "credential_sharing_settings_claim_unique" ON "credential_sharing_settings" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX "holder_authenticators_user_idx" ON "holder_authenticators" USING btree ("user_id","revoked_at");--> statement-breakpoint
CREATE INDEX "recipient_records_issuer_idx" ON "recipient_records" USING btree ("issuer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recipient_records_issuer_reference_unique" ON "recipient_records" USING btree ("issuer_id","institution_reference") WHERE institution_reference IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "structured_credentials_certificate_unique" ON "structured_credentials" USING btree ("certificate_row_id");--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_recipient_id_recipient_records_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."recipient_records"("id") ON DELETE no action ON UPDATE no action;