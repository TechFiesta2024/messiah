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
				"/school",
				async ({ log, body }) => {
					log.info(`/user/school : ${body.email}`);

					const userExists = await db.query.school_users.findFirst({
						where: eq(school_users.email, body.email),
					});

					if (userExists) {
						// compare the body with the userExists
						if (
							userExists.name !== body.name ||
							userExists.contact !== body.contact ||
							userExists.school !== body.school ||
							userExists.class !== body.class ||
							userExists.guardian_contact !==
								body.guardian_contact ||
							userExists.guardian_name !== body.guardian_name
						) {
							await db
								.update(school_users)
								.set({
									...body,
								})
								.where(eq(school_users.email, body.email));

							log.info(`user ${userExists.email} updated`);

							return {
								message: "Successfully updated",
								userid: userExists.id,
							};
						}

						log.info(`user ${userExists.email} logged in`);

						return {
							message: `Welcome back ${userExists.name}`,
							userid: userExists.id,
						};
					}

					const newUser = await db
						.insert(school_users)
						.values({
							id: randomUUID(),
							...body,
						})
						.returning({
							userid: school_users.id,
							name: school_users.name,
							email: school_users.email,
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
						school: t.String(),
						contact: t.String({
							maxLength: 10,
							minLength: 10,
							error: "invalid contact number",
						}),
						class: t.String(),
						guardian_contact: t.String({
							maxLength: 10,
							minLength: 10,
							error: "invalid contact number",
						}),
						guardian_name: t.String(),
					}),
					detail: {
						summary: "Register as school user",
						responses: {
							200: { description: "Success" },
							500: { description: "Internal server error" },
						},
						tags: ["user"],
					},
				},
			)
			.post(
				"/college",
				async ({ log, body }) => {
					log.info(`/user/college : ${body.email}`);

					const userExists = await db.query.college_users.findFirst({
						where: eq(college_users.email, body.email),
					});

					if (userExists) {
						// compare the body with the userExists
						if (
							userExists.name !== body.name ||
							userExists.contact !== body.contact ||
							userExists.college !== body.college ||
							userExists.stream !== body.stream ||
							userExists.year !== body.year
						) {
							await db
								.update(college_users)
								.set({
									...body,
								})
								.where(eq(college_users.email, body.email));

							log.info(`user ${userExists.email} updated`);

							return {
								message: "Successfully updated",
								userid: userExists.id,
							};
						}

						log.info(`user ${userExists.email} logged in`);

						return {
							message: `Welcome back ${userExists.name}`,
							userid: userExists.id,
						};
					}

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

					const collegeUsers = await db.query.college_users.findFirst(
						{
							where: eq(college_users.email, email),
							with: {
								workshop: true,
								team: true,
							},
						},
					);

					if (collegeUsers) {
						log.info(
							`college user ${collegeUsers.email} logged in`,
						);

						return {
							type: "college",
							...collegeUsers,
						};
					}
					const schoolUsers = await db.query.school_users.findFirst({
						where: eq(school_users.email, email),
						with: {
							team: true,
						},
					});

					if (schoolUsers) {
						log.info(`school user ${schoolUsers.email} logged in`);

						return {
							type: "school",
							...schoolUsers,
						};
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
