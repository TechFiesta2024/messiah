import { eq } from "drizzle-orm";
import { type Elysia, t } from "elysia";

import { db } from "../db";
import { events, college_users, school_users, teams } from "../db/schema";
import { sendEmail } from "../email";
import { log } from "../log";

enum category {
	creative_writing = "creative_writing",
	waste_to_art = "waste_to_art",
	extempore = "extempore",
	painting = "painting",
	ui_ux = "ui_ux",
	frontend = "frontend",
	ctf = "ctf",
	webathon = "webathon",
	treasure_hunt = "treasure_hunt",
	maze_solver = "maze_solver",
	race = "race",
	iot = "iot",
	circuits = "circuits",
	science_exhibition = "science_exhibition",
	cad = "cad",
	math = "math",
}

export const event = (app: Elysia) =>
	app.group("/event", (app) =>
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
					log.info(`/event/join/${id}`);
					if (!userid) {
						set.status = 401;
						throw new Error("user not logged in");
					}

					const user = await db.query.college_users.findFirst({
						where: eq(college_users.id, userid),
						with: {
							team: true,
							event: true,
						},
					});

					if (!user) {
						set.status = 400;
						throw new Error("user not found");
					}

					// solo events
					// team events
					// school events

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
						summary: "Register for an event",
						description:
							"Register for an event. User must be logged in to register for an event",
						parameters: [
							{
								name: "id",
								in: "path",
								schema: { type: "string" },
								required: true,
								description:
									"creative_writing | waste_to_art extempore | painting | ui_ux | frontend | ctf |	webathon | treasure_hunt | maze_solver | race | iot |circuits |science_exhibition |cad | math",
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
						tags: ["event"],
					},
				},
			),
	);
