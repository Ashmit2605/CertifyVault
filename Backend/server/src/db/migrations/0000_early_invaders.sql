CREATE TABLE IF NOT EXISTS "certificates" (
	"id" serial PRIMARY KEY NOT NULL,
	"certificate_id" varchar(100) NOT NULL,
	"student_name" varchar(255) NOT NULL,
	"course" varchar(255) NOT NULL,
	"certificate_hash" text NOT NULL,
	"blockchain_tx_hash" text,
	"issued_at" timestamp DEFAULT now(),
	CONSTRAINT "certificates_certificate_id_unique" UNIQUE("certificate_id")
);
