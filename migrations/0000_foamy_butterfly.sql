CREATE TABLE IF NOT EXISTS "ambassadors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"college" text NOT NULL,
	"contact" text NOT NULL,
	"description" text NOT NULL,
	"linkedin" text NOT NULL,
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
	"lead_name" text NOT NULL,
	"linkedin" text NOT NULL,
	CONSTRAINT "communities_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_uiux" (
	"name" text NOT NULL,
	"email" text NOT NULL,
	"contact" text NOT NULL,
	"isPaid" text DEFAULT 'no' NOT NULL,
	CONSTRAINT "event_uiux_email_unique" UNIQUE("email"),
	CONSTRAINT "event_uiux_contact_unique" UNIQUE("contact")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"leader_email" text NOT NULL,
	"leader_contact" text NOT NULL,
	"members" text[] NOT NULL,
	"events" text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"college" text NOT NULL,
	"stream" text NOT NULL,
	"contact" text NOT NULL,
	"year" text NOT NULL,
	"workshops" text[] NOT NULL,
	"team" text,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_contact_unique" UNIQUE("contact")
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_leader_email_users_email_fk" FOREIGN KEY ("leader_email") REFERENCES "users"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_leader_contact_users_contact_fk" FOREIGN KEY ("leader_contact") REFERENCES "users"("contact") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_team_teams_id_fk" FOREIGN KEY ("team") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
