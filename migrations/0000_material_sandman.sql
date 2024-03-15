DO $$ BEGIN
 CREATE TYPE "event_category" AS ENUM('creative_writing', 'waste_to_art', 'extempore', 'painting', 'ui_ux', 'frontend', 'ctf', 'webathon', 'treasure_hunt', 'maze_solver', 'race', 'iot', 'circuits', 'science_exhibition', 'cad', 'math');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "workshop_category" AS ENUM('product_design_lifecycle', 'git', 'business_logic', 'backend_deploy', 'cad', 'ctf', 'robotics', 'circuits', 'iot', 'fpga', 'embedded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "college_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"create_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"college" text NOT NULL,
	"stream" text NOT NULL,
	"contact" text NOT NULL,
	"year" text NOT NULL,
	"team_id" text,
	CONSTRAINT "college_users_email_unique" UNIQUE("email"),
	CONSTRAINT "college_users_contact_unique" UNIQUE("contact")
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
CREATE TABLE IF NOT EXISTS "events" (
	"category" "event_category" NOT NULL,
	"team_id" text,
	"college_user_id" uuid,
	"school_user_id" uuid,
	"payment_status" text DEFAULT 'not_paid' NOT NULL,
	CONSTRAINT "events_team_id_unique" UNIQUE("team_id"),
	CONSTRAINT "events_college_user_id_unique" UNIQUE("college_user_id"),
	CONSTRAINT "events_school_user_id_unique" UNIQUE("school_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "school_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"create_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"school" text NOT NULL,
	"contact" text NOT NULL,
	"class" text NOT NULL,
	"gardian_contact" text NOT NULL,
	"gardian_name" text NOT NULL,
	CONSTRAINT "school_users_email_unique" UNIQUE("email"),
	CONSTRAINT "school_users_contact_unique" UNIQUE("contact")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"name" text NOT NULL,
	"leader_email" text NOT NULL,
	"leader_contact" text NOT NULL,
	"code" text NOT NULL,
	CONSTRAINT "teams_leader_email_unique" UNIQUE("leader_email"),
	CONSTRAINT "teams_leader_contact_unique" UNIQUE("leader_contact"),
	CONSTRAINT "teams_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workshop" (
	"category" "workshop_category" NOT NULL,
	"user_email" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "college_users" ADD CONSTRAINT "college_users_team_id_teams_code_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_team_id_teams_code_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_college_user_id_college_users_id_fk" FOREIGN KEY ("college_user_id") REFERENCES "college_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_school_user_id_school_users_id_fk" FOREIGN KEY ("school_user_id") REFERENCES "school_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workshop" ADD CONSTRAINT "workshop_user_email_college_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "college_users"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
