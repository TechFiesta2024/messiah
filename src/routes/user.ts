import { randomUUID } from "node:crypto";
import { cookie } from "@elysiajs/cookie";
import { eq } from "drizzle-orm";
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
				ctx.log.error(ctx.error.message);

				return {
					message: ctx.error.message,
				};
			})
			.post(
				"/login",
				async ({ log, body, setCookie }) => {
					log.info(body);

					const userExists = await db
						.select({ id: users.id, name: users.name })
						.from(users)
						.where(eq(users.email, body.email));

					if (userExists) {
						setCookie("user", userExists[0].id);

						return {
							message: `welcome back ${userExists[0].name}`,
						};
					}

					const res = await db
						.insert(users)
						.values({
							id: randomUUID(),
							...body,
							workshops: [],
						})
						.returning({ id: users.id });

					setCookie("user", res[0].id);

					return {
						message: `welcome ${body.name}`,
					};
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
					detail: {
						summary: "Register as a user",
						description: "Register as a user and get a cookie",
						responses: {
							200: { description: "Success" },
							500: { description: "Internal server error" },
						},
						tags: ["user"],
					},
				},
			)
			.post(
				"/logout",
				({ cookie: { user } }) => {
					user.remove;
					return {
						message: "adios senor!",
					};
				},
				{
					detail: {
						summary: "Logout",
						description: "Logout the user",
						responses: {
							200: { description: "Success" },
						},
						tags: ["user"],
					},
				},
			)
			.get(
				"/me",
				async ({ set, cookie: { user } }) => {
					if (!user) {
						set.status = 401;
						throw new Error("user not logged in");
					}

					return await db
						.select()
						.from(users)
						.where(eq(users.id, user));
				},
				{
					detail: {
						summary: "Get user details",
						description: "Get the details of the logged in user",
						responses: {
							200: { description: "Success" },
							401: { description: "User not logged in" },
							500: { description: "Internal server error" },
						},
						tags: ["user"],
					},
				},
			),
	);
