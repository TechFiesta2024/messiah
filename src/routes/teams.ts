import { randomUUID } from "node:crypto";
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
					return `joined team ${id}`;
				},
				{
					headers: t.Object({
						userid: t.Optional(t.String()),
					}),
				},
			)
			.get("/:id", async ({ set, log, params: { id } }) => {
				return `team ${id}`;
			}),
	);
