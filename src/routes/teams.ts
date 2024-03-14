import { eq } from "drizzle-orm";
import { type Elysia, t } from "elysia";

import { db } from "../db";
import { college_users, teams } from "../db/schema";
import { log } from "../log";
import { generateRandomString } from "../utils";

export const team = (app: Elysia) =>
	app.group("/team", { detail: { tags: ["team"] } }, (app) =>
		app
			.use(log)
			.onError((ctx) => {
				ctx.log.error(ctx.error.message);
				return {
					message: ctx.error.message,
				};
			})
			.post(
				"/create",
				async ({ set, log, headers: { userid }, body }) => {
					log.info(`getting user details for user ${userid}`);

					const user = await db.query.college_users.findFirst({
						where: eq(college_users.id, userid),
						with: {
							team: true,
						},
					});

					if (!user) {
						set.status = 404;
						return "User not found";
					}
					if (user.team) {
						set.status = 400;
						return "User already in a team";
					}

					const code = generateRandomString(8);

					await db.insert(teams).values({
						code,
						leader_email: user.email,
						leader_contact: user.contact,
						name: body.name,
					});

					await db
						.update(college_users)
						.set({
							team_id: code,
						})
						.where(eq(college_users.id, userid));

					return `Team ${code} created`;
				},
				{
					headers: t.Object({
						userid: t.String({
							minLength: 36,
							maxLength: 36,
							error: "Invalid user id",
						}),
					}),
					body: t.Object({
						name: t.String({
							minLength: 3,
							maxLength: 50,
							error: "Invalid team name",
						}),
					}),
					detail: {
						summary: "Create a team",
						description: "Create a team and join it as a leader",
						responses: {
							200: { description: "Team created successfully" },
							500: { description: "Internal server error" },
						},
					},
				},
			)
			.post(
				"/join/:id",
				async ({ set, log, headers: { userid }, params: { id } }) => {
					log.info(`getting user details for user ${userid}`);

					const user = await db.query.college_users.findFirst({
						where: eq(college_users.id, userid),
						with: {
							team: true,
						},
					});

					if (!user) {
						set.status = 404;
						return "User not found";
					}
					if (user.team && user.team.code === id) {
						set.status = 400;
						return "User already in a team";
					}

					const team = await db.query.teams.findFirst({
						where: eq(teams.code, id),
					});

					if (!team) {
						set.status = 404;
						return "team not found";
					}

					await db
						.update(college_users)
						.set({
							team_id: id,
						})
						.where(eq(college_users.id, userid));

					return `user ${userid} joined team ${id}`;
				},
				{
					headers: t.Object({
						userid: t.String({
							minLength: 36,
							maxLength: 36,
							error: "Invalid user id",
						}),
					}),
					params: t.Object({
						id: t.String({
							minLength: 8,
							maxLength: 8,
							error: "Invalid team id",
						}),
					}),
					detail: {
						summary: "Join a team",
						description: "Join a team as a member",
						responses: {
							200: { description: "Team joined successfully" },
							500: { description: "Internal server error" },
						},
					},
				},
			)
			.post(
				"/leave",
				async ({ set, log, headers: { userid, teamid } }) => {
					const user = await db.query.college_users.findFirst({
						where: eq(college_users.id, userid),
						with: {
							team: true,
						},
					});

					const team_exists = await db.query.teams.findFirst({
						where: eq(teams.code, teamid),
					});

					if (!user) {
						set.status = 404;
						return "User not found";
					}
					if (user.team && user.team.code !== teamid) {
						set.status = 400;
						return "User not in a team";
					}

					if (!team_exists) {
						set.status = 404;
						return "Team not found";
					}

					if (user.email === team_exists.leader_email) {
						set.status = 400;
						return "Leader cannot leave the team";
					}

					await db
						.update(college_users)
						.set({
							team_id: null,
						})
						.where(eq(college_users.id, userid));

					return `User ${user.email} left team ${team_exists.name}`;
				},
				{
					headers: t.Object({
						userid: t.String({
							minLength: 36,
							maxLength: 36,
							error: "Invalid user id",
						}),
						teamid: t.String({
							minLength: 8,
							maxLength: 8,
							error: "Invalid team id",
						}),
					}),
					detail: {
						summary: "Leave a team",
						description: "Leave a team",
						responses: {
							200: { description: "Team left successfully" },
							500: { description: "Internal server error" },
						},
					},
				},
			)
			.post(
				"/delete/:id",
				async ({ set, log, headers: { userid }, params: { id } }) => {
					const team_exists = await db.query.teams.findFirst({
						where: eq(teams.code, id),
					});

					if (!team_exists || !userid) {
						set.status = 404;
						return "Team not found or user not logged in";
					}

					const user = await db.query.college_users.findFirst({
						where: eq(college_users.id, userid),
					});

					if (user && user.email !== team_exists.leader_email) {
						set.status = 401;
						return "User not authorized to delete the team";
					}

					await db
						.update(college_users)
						.set({ team_id: null })
						.where(eq(college_users.team_id, id));

					await db.delete(teams).where(eq(teams.code, id));

					return `Team ${team_exists.name} deleted`;
				},
				{
					params: t.Object({
						id: t.String({
							minLength: 8,
							maxLength: 8,
							error: "Invalid team id",
						}),
					}),
					headers: t.Object({
						userid: t.String({
							minLength: 36,
							mixLength: 36,
							error: "Invalid user",
						}),
					}),
					detail: {
						summary: "Delete a team",
						description: "Delete a team",
						responses: {
							200: { description: "Team deleted successfully" },
							500: { description: "Internal server error" },
						},
					},
				},
			),
	);
