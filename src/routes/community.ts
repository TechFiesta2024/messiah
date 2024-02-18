import { Elysia, t } from "elysia";

import { log } from "../log";
import { pool } from "../db";

export const community = (app: Elysia) =>
	app.group("/community", (app) =>
		app
			.use(log)
			.decorate("dbpool", pool)
			.onError((ctx) => {
				ctx.log.error(ctx, ctx.error.message);
				return ctx.error.message;
			})
			.post(
				"/ambassador",
				async (ctx) => {
					ctx.log.info(ctx.body);
					return ctx.body;
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
				async (ctx) => {
					return ctx.body;
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
