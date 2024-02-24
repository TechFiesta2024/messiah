import { randomUUID } from "node:crypto";
import { Elysia, t } from "elysia";

import { db } from "../db";
import { ambassadors, communities } from "../db/schema";
import { log } from "../log";

export const community = (app: Elysia) =>
	app.group("/community", (app) =>
		app
			.use(log)
			.onError((ctx) => {
				ctx.log.error(ctx, ctx.error.message);
				return ctx.error.message;
			})
			.post(
				"/ambassador",
				async ({ body, log }) => {
					log.info(`received request: ${body}`);
					const res = await db
						.insert(ambassadors)
						.values({
							id: randomUUID(),
							...body,
						})
						.returning();
					return res;
				},
				{
					body: t.Object({
						ambassador_name: t.String(),
						ambassador_email: t.String({
							format: "email",
							errror: "invalid email",
						}),
						ambassador_college: t.String(),
						ambassador_contact: t.String({
							maxLength: 10,
							minLength: 10,
							error: "invalid contact number",
						}),
						ambassador_linkedin: t.String(),
						ambassador_description: t.String({
							maxLength: 200,
						}),
					}),
				},
			)
			.post(
				"/collab",
				async ({ log, body }) => {
					log.info("/community/collab");
					log.info(body);
					await db.insert(communities).values({
						id: randomUUID(),
						...body,
					});
					return "success";
				},
				{
					body: t.Object({
						community_name: t.String(),
						community_email: t.String({
							format: "email",
							errror: "invalid email",
						}),
						community_college: t.String(),
						community_lead_name: t.String(),
						community_linkedin: t.String(),
						community_contact: t.String({
							maxLength: 10,
							minLength: 10,
							error: "invalid contact number",
						}),
					}),
				},
			),
	);
