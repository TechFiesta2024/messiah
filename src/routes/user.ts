import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "../db";
import { college_users, school_users } from "../db/schema";
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
				"/college",
				async ({ log, body }) => {
					log.info(`/user/college : ${body.email}`);

					// const userExists = await db.query.college_users.findFirst({
					// 	where: eq(college_users.email, body.email),
					// });
					//
					// if (userExists) {
					// 	log.info(`user ${userExists.email} logged in`);
					//
					// 	return {
					// 		message: `Welcome back ${userExists.name}`,
					// 		userid: userExists.id,
					// 	};
					// }

					const newUser = await db
						.insert(college_users)
						.values({
							id: randomUUID(),
							...body,
						})
						.returning({
							userid: college_users.id,
							name: college_users.name,
							email: college_users.email,
						});

					log.info(`new user ${newUser[0].email} logged in`);

					await sendEmail(
						newUser[0].name,
						newUser[0].email,
						"Welcome To TechFiesta24 🎉",
						welcome,
					);

					return {
						message: `Welcome ${newUser[0].name}`,
						userid: newUser[0].userid,
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
			.get(
				"/",
				async ({ log, set, headers: { email } }) => {
					log.info(`getting user details for user ${email}`);

					const userExists = await db.query.college_users.findFirst({
						where: eq(college_users.email, email),
						with: {
							workshop: true,
							team: true,
						},
					});

					if (userExists) {
						log.info(`user ${userExists.email} logged in`);

						return userExists;
					}

					log.info(`user ${email} does not exist`);

					return {
						message: "User does not exist",
					};
				},
				{
					headers: t.Object({
						email: t.String(),
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
