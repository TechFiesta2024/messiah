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
						name: t.String(),
						email: t.String({
							format: "email",
							errror: "invalid email",
						}),
						college: t.String(),
						contact: t.String({
							maxLength: 10,
							minLength: 10,
							error: "invalid contact number",
						}),
						linkedin: t.String(),
						twitter: t.String(),
						description: t.String(),
					}),
				},
			)
			.post(
				"/collab",
				async ({ log, body }) => {
					log.info("/community/collab");
					log.info(body);
					const res = await db.insert(communities).values({
						id: randomUUID(),
						...body,
					});
					return res;
				},
				{
					body: t.Object({
						name: t.String(),
						email: t.String({
							format: "email",
							errror: "invalid email",
						}),
						college: t.String(),
						contact: t.String({
							maxLength: 10,
							minLength: 10,
							error: "invalid contact number",
						}),
					}),
				},
			),
	);
