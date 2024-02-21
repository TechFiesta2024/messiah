import { cookie } from "@elysiajs/cookie";
import { Elysia, t } from "elysia";

import { pool } from "../db";
import { log } from "../log";

// product design workshop -> 1

export const workshop = (app: Elysia) =>
	app.group("/workshop", (app) =>
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
				"/join/:id",
				async ({ log, dbpool, cookie: { user }, params: { id } }) => {
					if (!user) {
						throw new Error("user not logged in");
					}

					const userInfo = await dbpool.query(
						"SELECT * FROM users WHERE id = $1",
						[user],
					);

					const res = await dbpool.query(
						`INSERT INTO workshop_${id} (id, name, email, contact, stream, year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
						[
							userInfo.rows[0].id,
							userInfo.rows[0].name,
							userInfo.rows[0].email,
							userInfo.rows[0].contact,
							userInfo.rows[0].stream,
							userInfo.rows[0].year,
						],
					);

					return `${userInfo.rows[0].name} joined workshop ${id}\n ${res.rows[0]}`;
				},
				{
					params: t.Object({
						id: t.String({}),
					}),
				},
			),
	);
