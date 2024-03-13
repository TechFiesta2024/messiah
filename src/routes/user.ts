import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "../db";
import { college_users, school_users } from "../db/schema";
import { sendEmail } from "../email";
import { WelcomeEmailHtml } from "../emails/welcome";
import { log } from "../log";

export const user = (app: Elysia) =>
	app.group("/user", { detail: { tags: ["user"] } }, (app) =>
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
								id: userExists.id,
							};
						}

						log.info(`user ${userExists.email} logged in`);

						return {
							message: `Welcome back ${userExists.name}`,
							id: userExists.id,
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
						WelcomeEmailHtml,
					);

					return {
						message: `Welcome ${newUser[0].name}`,
						id: newUser[0].userid,
					};
				},
				{
					body: t.Object({
						name: t.String({
							error: "Name is required",
							minLength: 4,
						}),
						email: t.String({
							format: "email",
							errror: "Invalid email",
						}),
						school: t.String({
							error: "School is required",
							minLength: 3,
						}),
						contact: t.String({
							maxLength: 10,
							minLength: 10,
							error: "Invalid contact number",
						}),
						class: t.String({
							error: "Class is required",
							minLength: 1,
						}),
						guardian_contact: t.String({
							maxLength: 10,
							minLength: 10,
							error: "Invalid contact number",
						}),
						guardian_name: t.String({
							error: "Guardian name is required",
							minLength: 4,
						}),
					}),
					detail: {
						summary: "Register/Update/Login a school user",
						description: "Register and update a school",
						responses: {
							200: {
								description: "Success",
								content: {
									"application/json": {
										schema: t.Object({
											message: t.String(),
											id: t.String(),
										}),
									},
								},
							},
							500: {
								description: "Internal server error",
								content: {
									"application/json": {
										schema: t.Object({
											message: t.String(),
										}),
									},
								},
							},
						},
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
								id: userExists.id,
							};
						}

						log.info(`user ${userExists.email} logged in`);

						return {
							message: `Welcome back ${userExists.name}`,
							id: userExists.id,
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
						WelcomeEmailHtml,
					);

					return {
						message: `Welcome ${newUser[0].name}`,
						id: newUser[0].userid,
					};
				},
				{
					body: t.Object({
						name: t.String({
							minLength: 4,
							error: "Name is required",
						}),
						email: t.String({
							format: "email",
							errror: "Invalid email",
						}),
						college: t.String({
							minLength: 3,
							error: "College is required",
						}),
						contact: t.String({
							maxLength: 10,
							minLength: 10,
							error: "Invalid contact number",
						}),
						stream: t.String({
							minLength: 1,
							error: "Stream is required",
						}),
						year: t.String({
							minLength: 1,
							error: "Year is required",
						}),
					}),
					detail: {
						summary: "Register/Update/Login a college user",
						description: "Register and update a college",
						responses: {
							200: {
								description: "Success",
								content: {
									"application/json": {
										schema: t.Object({
											message: t.String(),
											id: t.String(),
										}),
									},
								},
							},
							500: {
								description: "Internal server error",
								content: {
									"application/json": {
										schema: t.Object({
											message: t.String(),
										}),
									},
								},
							},
						},
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
								event: true,
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
							event: true,
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

					set.status = 403;

					return {
						message: "User does not exist",
					};
				},
				{
					headers: t.Object({
						email: t.String({
							minLength: 4,
							format: "email",
							error: "Email is required",
						}),
					}),
					detail: {
						summary: "Get user details",
						description: "Get the details of the logged in user",
						responses: {
							200: {
								description: "Success",
								content: {
									"application/json": {
										schema: t.Object({
											type: t.String(),
											college_users: t.Object({}),
											school_users: t.Object({}),
										}),
									},
								},
							},
							401: { description: "User not logged in" },
							500: { description: "Internal server error" },
						},
					},
				},
			),
	);
