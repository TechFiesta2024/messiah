import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "../db";
import { college_users, workshops } from "../db/schema";
import { sendEmail } from "../email";
import { log } from "../log";

enum category {
	product_design = "product_design",
	hardware = "hardware",
	cad = "cad",
	ctf = "ctf",
}

export const workshop = (app: Elysia) =>
	app.group("/workshop", (app) =>
		app
			.use(log)
			.onError((ctx) => {
				ctx.log.error(ctx.error.message);
				return {
					message: ctx.error.message,
				};
			})
			.post(
				"/join/:id",
				async ({ set, log, headers: { userid }, params: { id } }) => {
					log.info(`/workshop/join : ${id}`);
					if (!userid) {
						set.status = 401;
						throw new Error("user not logged in");
					}

					const user = await db.query.college_users.findFirst({
						where: eq(college_users.id, userid),
						with: {
							workshop: true,
						},
					});

					if (!user) {
						set.status = 400;
						throw new Error("user not found");
					}

					if (user.workshop.some((obj) => obj.category === id)) {
						return {
							message: "Already joined",
						};
					}

					await db.insert(workshops).values({
						category: id as category,
						user_email: user.email,
					});

					return {
						message: "Successfully joined",
					};
				},
				{
					params: t.Object({
						id: t.Enum(category),
					}),
					headers: t.Object({
						userid: t.Optional(t.String()),
					}),
					detail: {
						summary: "Join a workshop",
						description:
							"Join a workshop by providing the id of the workshop",
						parameters: [
							{
								name: "id",
								in: "path",
								schema: { type: "string" },
								required: true,
								description:
									"product_design | hardware | cad | ctf",
							},
						],
						responses: {
							200: {
								description: "Success",
								content: {
									"application/json": {
										schema: {
											type: "object",
											properties: {
												message: { type: "string" },
											},
										},
									},
								},
							},
							400: {
								description:
									"Invalid workshop | User tampered with the cookie",
							},
							401: { description: "User not logged in" },
							500: { description: "Internal server error" },
						},
						tags: ["workshop"],
					},
				},
			),
	);
