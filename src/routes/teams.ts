import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "../db";
import { teams, users } from "../db/schema";
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

					const user = await db
						.select()
						.from(users)
						.where(eq(users.id, userid));

					if (user && user.length > 0) {
						if (!user[0].team) {
							const id = generateRandomString(8);
							const team = await db.insert(teams).values({
								id,
								name: body.name,
								leader_email: user[0].email,
								leader_contact: user[0].contact,
								members: [user[0].id],
								event: [],
							});

							if (team && team.length > 0) {
								await db
									.update(users)
									.set({ team: id })
									.where(eq(users.id, user[0].id));
							}

							log.info(team);

							return `Created team for user ${user[0].name}`;
						}
						return "user already in a team";
					}

					return "user not found";
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
