import { Elysia, t } from "elysia";

import { pool } from "../db";
import { log } from "../log";

export const workshop = (app: Elysia) =>
	app.group("/workshop", (app) =>
		app
			.use(log)
			.decorate("dbpool", pool)
			.onError((ctx) => {
				ctx.log.error(ctx, ctx.error.message);
				return ctx.error.message;
			})
			.post(
				"/join",
				async (ctx) => {
					ctx.log.info(ctx.body);
					const res = await ctx.dbpool.query(
						"INSERT INTO ambassador (name, email, college, contact, linkedin, twitter, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
						[...Object.values(ctx.body)],
					);
					return res.rows[0];
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
			.get("/", async () => {
				// const res = await ctx.dbpool.query(
				// 	"INSERT INTO community (name, email, college, contact) VALUES ($1, $2, $3, $4) RETURNING *",
				// 	[...Object.values(ctx.body)],
				// );
				// return res.rows[0];
				return "hello";
			}),
	);
