import { cookie } from "@elysiajs/cookie";
import { Elysia, t } from "elysia";

import { pool } from "../db";
import { log } from "../log";

export const user = (app: Elysia) =>
	app.group("/user", (app) =>
		app
			.use(log)
			.use(
				cookie({
					httpOnly: true,
				}),
			)
			.decorate("dbpool", pool)
			.onError((ctx) => {
				ctx.log.error(ctx, ctx.error.message);
				return ctx.error.message;
			})
			.post(
				"/login",
				async (ctx) => {
					ctx.log.info(ctx.body);
					const res = await ctx.dbpool.query(
						"INSERT INTO users (name, email, college, contact, stream, year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
						[...Object.values(ctx.body)],
					);
					ctx.setCookie("user", res.rows[0].id);
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
						stream: t.String(),
						year: t.Number({
							maximum: 4,
							minimum: 1,
							error: "invalid year",
						}),
					}),
				},
			)
			.post("/logout", (ctx) => {
				ctx.removeCookie("user");
				return "adios senor";
			}),
	);
