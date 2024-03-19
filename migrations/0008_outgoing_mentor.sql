ALTER TABLE "college_users" ADD COLUMN "team_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "college_users" ADD CONSTRAINT "college_users_team_id_teams_code_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
