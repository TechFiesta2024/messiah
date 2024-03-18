ALTER TYPE "event_category" ADD VALUE 'extempore_sr';--> statement-breakpoint
ALTER TYPE "event_category" ADD VALUE 'extempore_jr';--> statement-breakpoint
ALTER TYPE "event_category" ADD VALUE 'painting_sr';--> statement-breakpoint
ALTER TYPE "event_category" ADD VALUE 'painting_jr';--> statement-breakpoint
ALTER TABLE "school_users" ADD COLUMN "team_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "school_users" ADD CONSTRAINT "school_users_team_id_teams_code_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
