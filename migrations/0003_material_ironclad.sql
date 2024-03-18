ALTER TABLE "college_users" DROP CONSTRAINT "college_users_contact_unique";--> statement-breakpoint
ALTER TABLE "school_users" DROP CONSTRAINT "school_users_contact_unique";--> statement-breakpoint
ALTER TABLE "school_users" ALTER COLUMN "team_id" SET DEFAULT 'null';