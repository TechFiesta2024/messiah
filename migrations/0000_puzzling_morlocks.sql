CREATE TABLE IF NOT EXISTS "ambassadors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"college" text NOT NULL,
	"contact" text NOT NULL,
	"description" text NOT NULL,
	"linkedin" text,
	"twitter" text,
	CONSTRAINT "ambassadors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "communities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"college" text NOT NULL,
	"contact" text NOT NULL,
	CONSTRAINT "communities_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"college" text NOT NULL,
	"stream" text NOT NULL,
	"year" text NOT NULL,
	"workshops" text[] NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workshop_cad" (
	"name" text NOT NULL,
	"email" text PRIMARY KEY NOT NULL,
	"college" text NOT NULL,
	"stream" text NOT NULL,
	"year" text NOT NULL,
	CONSTRAINT "workshop_cad_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workshop_ctf" (
	"name" text NOT NULL,
	"email" text PRIMARY KEY NOT NULL,
	"college" text NOT NULL,
	"stream" text NOT NULL,
	"year" text NOT NULL,
	CONSTRAINT "workshop_ctf_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workshop_hardware" (
	"name" text NOT NULL,
	"email" text PRIMARY KEY NOT NULL,
	"college" text NOT NULL,
	"stream" text NOT NULL,
	"year" text NOT NULL,
	CONSTRAINT "workshop_hardware_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workshop_product" (
	"name" text NOT NULL,
	"email" text PRIMARY KEY NOT NULL,
	"college" text NOT NULL,
	"stream" text NOT NULL,
	"year" text NOT NULL,
	CONSTRAINT "workshop_product_email_unique" UNIQUE("email")
);
