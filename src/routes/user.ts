import { randomUUID } from "node:crypto";
import { cookie } from "@elysiajs/cookie";
import { Elysia, t } from "elysia";

import { db } from "../db";
import { users } from "../db/schema";
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
			.onError((ctx) => {
				ctx.log.error(ctx, ctx.error.message);
				return ctx.error.message;
			})
			.post(
				"/login",
				async ({ log, body, setCookie }) => {
					log.info(body);

					const res = await db
						.insert(users)
						.values({
							id: randomUUID(),
							...body,
							workshops: [],
						})
						.returning({ id: users.id });

					setCookie("user", res[0].id);

					return res[0].id;
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
						year: t.String(),
					}),
				},
			)
			.post("/logout", ({ cookie: { user } }) => {
				user.remove;
				return "adios senor";
			}),
	);
