import { eq } from "drizzle-orm";
import { type Elysia, t } from "elysia";

import { db } from "../db";
import { college_users, school_users, teams } from "../db/schema";
import { log } from "../log";
import { generateRandomString } from "../utils";

enum type {
	school = "school",
	college = "college",
}

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
			.get(
				"/:id",
				async ({ set, log, params: { id } }) => {
					log.info(`/team/${id}`);
					const team = await db.query.teams.findFirst({
						where: eq(teams.code, id),
						with: {
							event: true,
							school_members: true,
							college_members: true,
						},
					});
					if (!team) {
						set.status = 404;
						throw new Error("Team not found");
					}
					return team;
				},
				{
					params: t.Object({
						id: t.String({
							minLength: 8,
							maxLength: 8,
							error: "Invalid team id",
						}),
					}),

					detail: {
						summary: "Get team details",
						description: "Get team details",
						responses: {
							200: { description: "Team details" },
							404: { description: "Team not found" },
							500: { description: "Internal server error" },
						},
					},
				},
			)
			.post(
				"/create",
				async ({ set, log, headers: { userid }, body }) => {
					log.info(`getting user details for user ${userid}`);

					if (body.type === type.school) {
						const user = await db.query.school_users.findFirst({
							where: eq(school_users.id, userid),
							with: {
								team: true,
							},
						});

						if (!user) {
							set.status = 404;
							throw new Error("User not found");
						}

						if (user.team) {
							set.status = 400;
							throw new Error("User already in a team");
						}

						const code = generateRandomString(8);

						await db.insert(teams).values({
							code,
							leader_email: user.email,
							leader_contact: user.contact,
							name: body.name,
						});

						await db
							.update(school_users)
							.set({
								team_id: code,
							})
							.where(eq(school_users.id, userid));

						return {
							message: `Team ${body.name} created`,
							code,
						};
					}

					const user = await db.query.college_users.findFirst({
						where: eq(college_users.id, userid),
						with: {
							team: true,
						},
					});

					if (!user) {
						set.status = 404;
						throw new Error("User not found");
					}
					if (user.team) {
						set.status = 400;
						throw new Error("User already in a team");
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

					return {
						message: `Team ${body.name} created`,
						code,
					};
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
						type: t.Enum(type),
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

					const college_user = await db.query.college_users.findFirst(
						{
							where: eq(college_users.id, userid),
							with: {
								team: true,
							},
						},
					);

					if (college_user) {
						if (college_user.team) {
							set.status = 400;
							throw new Error("User already in a team");
						}

						const team = await db.query.teams.findFirst({
							where: eq(teams.code, id),
							with: {
								college_members: true,
								school_members: true,
							},
						});

						if (!team) {
							set.status = 404;
							throw new Error("Team not found");
						}

						if (
							team.college_members.length >= 1 &&
							team.school_members.length === 0
						) {
							await db
								.update(college_users)
								.set({
									team_id: id,
								})
								.where(eq(college_users.id, userid));

							return {
								message: `User ${college_user.name} joined team ${team.name}`,
								code: team.code,
							};
						}

						set.status = 400;
						throw new Error(
							"College students can't join school teams",
						);
					}

					const school_user = await db.query.school_users.findFirst({
						where: eq(school_users.id, userid),
						with: {
							team: true,
						},
					});

					if (school_user) {
						if (school_user.team && school_user.team.code === id) {
							set.status = 400;
							throw new Error("User already in a team");
						}
						const team = await db.query.teams.findFirst({
							where: eq(teams.code, id),

							with: {
								college_members: true,
								school_members: true,
							},
						});
						if (!team) {
							set.status = 404;
							throw new Error("Team not found");
						}

						if (
							team.school_members.length >= 1 &&
							team.college_members.length === 0
						) {
							await db
								.update(school_users)
								.set({
									team_id: id,
								})
								.where(eq(school_users.id, userid));
							return {
								message: `User ${school_user.name} joined team ${team.name}`,
								code: team.code,
							};
						}

						set.status = 400;
						throw new Error(
							"School students can't join college teams",
						);
					}

					set.status = 404;
					throw new Error("User not found");
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
				"/kick",
				async ({
					set,
					log,
					headers: { userid, teamid, kickme_email },
				}) => {
					const team_exists = await db.query.teams.findFirst({
						where: eq(teams.code, teamid),
					});

					if (!team_exists) {
						set.status = 404;
						throw new Error("Team not found");
					}

					const college_leader =
						await db.query.college_users.findFirst({
							where: eq(college_users.id, userid),
							with: {
								team: true,
							},
						});

					if (college_leader) {
						if (
							college_leader.team &&
							college_leader.team.code !== teamid
						) {
							set.status = 400;
							throw new Error("User not in a team");
						}

						if (college_leader.email === team_exists.leader_email) {
							await db
								.update(college_users)
								.set({
									team_id: null,
								})
								.where(eq(college_users.email, kickme_email));

							return {
								message: `User ${kickme_email} left team ${team_exists.name}`,
							};
						}

						if (college_leader.email === kickme_email) {
							set.status = 400;
							throw new Error("Leader cannot leave the team");
						}
					}

					const school_leader = await db.query.school_users.findFirst(
						{
							where: eq(school_users.id, userid),
							with: {
								team: true,
							},
						},
					);

					if (school_leader) {
						if (
							school_leader.team &&
							school_leader.team.code !== teamid
						) {
							set.status = 400;
							throw new Error("User not in a team");
						}
						if (school_leader.email === team_exists.leader_email) {
							await db
								.update(school_users)
								.set({
									team_id: null,
								})
								.where(eq(school_users.email, kickme_email));
							return {
								message: `User ${kickme_email} left team ${team_exists.name}`,
							};
						}
						if (school_leader.email === kickme_email) {
							set.status = 400;
							throw new Error("Leader cannot leave the team");
						}
					}

					set.status = 404;
					throw new Error("User not found, try logging in again");
				},
				{
					headers: t.Object({
						kickme_email: t.String({
							format: "email",
							error: "Invalid email",
						}),
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
						summary: "Kick a team member",
						description: "Kick a team member",
						responses: {
							200: { description: "Successfully Kick" },
							400: { description: "Bad request" },
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
						with: {
							event: true,
						},
					});

					if (!team_exists || !userid) {
						set.status = 404;
						throw new Error("Team not found");
					}

					if (team_exists.event.length > 0) {
						set.status = 400;
						throw new Error(
							"Team is participating in an event cannot delete team",
						);
					}

					const college_user = await db.query.college_users.findFirst(
						{
							where: eq(college_users.id, userid),
						},
					);

					if (college_user) {
						if (college_user.email !== team_exists.leader_email) {
							set.status = 401;
							throw new Error(
								"User not authorized to delete the team",
							);
						}

						await db
							.update(college_users)
							.set({ team_id: null })
							.where(eq(college_users.team_id, id));

						await db.delete(teams).where(eq(teams.code, id));

						return { message: `Team ${team_exists.name} deleted` };
					}

					const school_user = await db.query.school_users.findFirst({
						where: eq(school_users.id, userid),
					});

					if (school_user) {
						if (school_user.email !== team_exists.leader_email) {
							set.status = 401;
							throw new Error(
								"User not authorized to delete the team",
							);
						}

						await db
							.update(school_users)
							.set({ team_id: null })
							.where(eq(school_users.team_id, id));

						await db.delete(teams).where(eq(teams.code, id));

						return { message: `Team ${team_exists.name} deleted` };
					}
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
