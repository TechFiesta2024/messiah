import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "../db";
import { college_users, teams } from "../db/schema";
import { log } from "../log";
import { generateRandomString } from "../utils";

export const team = (app: Elysia) =>
	app.group("/team", (app) =>
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
					if (!userid) {
						set.status = 401;
						throw new Error("User not logged in");
					}

					log.info(`getting user details for user ${userid}`);

					const user = await db.query.college_users.findFirst({
						where: eq(college_users.id, userid),
						with: {
							team: true,
						},
					});

					if (!user) {
						return "user not found";
					}
					if (user.team) {
						return "user already in a team";
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

					return `team ${code} created`;
				},
				{
					headers: t.Object({
						userid: t.Optional(t.String()),
					}),
					body: t.Object({
						name: t.String(),
					}),
				},
			)
			.post(
				"/join/:id",
				async ({ set, log, headers: { userid }, params: { id } }) => {
					if (!userid) {
						set.status = 401;
						throw new Error("User not logged in");
					}

					log.info(`getting user details for user ${userid}`);

					const user = await db.query.college_users.findFirst({
						where: eq(college_users.id, userid),
						with: {
							team: true,
						},
					});

					if (!user) {
						return "user not found";
					}
					if (user.team && user.team.code === id) {
						return "user already in a team";
					}

					const team = await db.query.teams.findFirst({
						where: eq(teams.code, id),
					});

					if (!team) {
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
						userid: t.Optional(t.String()),
					}),
				},
			)
			.post(
				"/leave",
				async ({ set, log, headers: { userid, teamid } }) => {
					if (!userid || !teamid) {
						set.status = 401;
						throw new Error(
							"User not logged in or team not provided",
						);
					}

					const user = await db.query.college_users.findFirst({
						where: eq(college_users.id, userid),
						with: {
							team: true,
						},
					});

					const team = await db.query.teams.findFirst({
						where: eq(teams.code, teamid),
					});

					if (!user) {
						return "user not found";
					}
					if (user.team && user.team.code !== teamid) {
						return "user not in a team";
					}

					if (!team) {
						return "team not found";
					}

					if (user.email === team.leader_email) {
						return "leader cannot leave the team";
					}

					await db
						.update(college_users)
						.set({
							team_id: null,
						})
						.where(eq(college_users.id, userid));

					return `user ${user.email} left team ${teamid}`;
				},
				{
					headers: t.Object({
						userid: t.Optional(t.String()),
						teamid: t.Optional(t.String()),
					}),
				},
			)
			.post(
				"/delete/:id",
				async ({ set, log, headers: { userid }, params: { id } }) => {
					const team = await db.query.teams.findFirst({
						where: eq(teams.code, id),
					});
					if (!team || !userid) {
						set.status = 404;
						return "team not found or user not logged in";
					}

					const user = await db.query.college_users.findFirst({
						where: eq(college_users.id, userid),
					});

					if (user && user.email !== team.leader_email) {
						set.status = 401;
						return "user not authorized to delete the team";
					}

					await db
						.update(college_users)
						.set({ team_id: null })
						.where(eq(college_users.team_id, id));
					await db.delete(teams).where(eq(teams.code, id));
					return `team ${id} deleted`;
				},
				{
					params: t.Object({ id: t.String() }),
					headers: t.Object({ userid: t.Optional(t.String()) }),
				},
			),
	);
