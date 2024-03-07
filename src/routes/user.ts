import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "../db";
import { users } from "../db/schema";
import { sendEmail } from "../email";
import { welcome } from "../emails/welcome";
import { log } from "../log";

export const user = (app: Elysia) =>
	app.group("/user", (app) =>
		app
			.use(log)
			.onError((ctx) => {
				ctx.log.error(ctx.error.message);

				return {
					message: ctx.error.message,
				};
			})
			.post(
				"/login",
				async ({ log, body }) => {
					log.info(body);

					const userExists = await db
						.select()
						.from(users)
						.where(eq(users.email, body.email));

					if (userExists && userExists.length > 0) {
						// compare the body with the user and update the user
						if (
							userExists[0].name !== body.name ||
							userExists[0].college !== body.college ||
							userExists[0].contact !== body.contact ||
							userExists[0].stream !== body.stream ||
							userExists[0].year !== body.year
						) {
							await db
								.update(users)
								.set({
									name: body.name,
									college: body.college,
									contact: body.contact,
									stream: body.stream,
									year: body.year,
								})
								.where(eq(users.email, body.email));

							log.info(`user ${userExists[0].email} was updated`);

							return {
								message: `updated ${userExists[0].email}`,
								userid: userExists[0].id,
							};
						}

						// login user
						log.info(`user ${userExists[0].name} logged in`);

						return {
							message: `welcome back ${userExists[0].name}`,
							userid: userExists[0].id,
						};
					}

					const res = await db
						.insert(users)
						.values({
							id: randomUUID(),
							...body,
							workshops: [],
						})
						.returning({
							id: users.id,
							name: users.name,
							email: users.email,
						});
					log.info(`new user ${res[0].email} logged in`);

					await sendEmail(
						res[0].name,
						res[0].email,
						"Welcome To TechFiesta24 🎉",
						welcome,
					);

					return {
						message: `welcome ${body.name}`,
						userid: res[0].id,
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
				"/checkemail",
				async ({ log, body: { email }, set }) => {
					log.info(`checking if user with email ${email} exists`);

					const userExists = await db
						.select({ id: users.id, name: users.name })
						.from(users)
						.where(eq(users.email, email));

					if (userExists && userExists.length > 0) {
						log.info(`user ${email} logged in`);
						return {
							message: `welcome back ${userExists[0].name}!`,
							userid: userExists[0].id,
						};
					}

					set.status = 401;
					return {
						message: "user does not exist",
					};
				},
				{
					body: t.Object({
						email: t.String({
							format: "email",
							errror: "invalid email",
						}),
					}),
					detail: {
						summary: "Check Email",
						description:
							"See if the user exists in the database and set a cookie",
						responses: {
							200: { description: "Success" },
							401: { description: "User does not exist" },
						},
						tags: ["user"],
					},
				},
			)
			.get(
				"/me",
				async ({ log, set, headers: { userid } }) => {
					if (!userid) {
						set.status = 401;
						throw new Error("user not logged in");
					}

					log.info(`getting user details for user ${userid}`);

					return await db
						.select()
						.from(users)
						.where(eq(users.id, userid));
				},
				{
					headers: t.Object({
						userid: t.Optional(t.String()),
					}),
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
