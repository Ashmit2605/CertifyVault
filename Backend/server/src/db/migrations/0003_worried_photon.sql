ALTER TABLE "certificates" ADD COLUMN "certificate_number" varchar(100);--> statement-breakpoint
CREATE INDEX "certificate_audit_logs_certificate_created_idx" ON "certificate_audit_logs" USING btree ("certificate_row_id","created_at");--> statement-breakpoint
CREATE INDEX "certificates_issuer_id_idx" ON "certificates" USING btree ("issuer_id");--> statement-breakpoint
CREATE INDEX "certificates_issuer_status_idx" ON "certificates" USING btree ("issuer_id","status");--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_certificate_number_unique" UNIQUE("certificate_number");