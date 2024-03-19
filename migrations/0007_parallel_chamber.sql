ALTER TABLE "college_users" DROP CONSTRAINT "college_users_team_id_teams_code_fk";
--> statement-breakpoint
ALTER TABLE "college_users" DROP COLUMN IF EXISTS "team_id";