import { eq } from "drizzle-orm";
import { type Elysia, t } from "elysia";

import { db } from "../db";
import { events, college_users, school_users, teams } from "../db/schema";
import { sendEmail } from "../email";
import { log } from "../log";

enum category {
	creative_writing = "creative_writing",
	waste_to_art = "waste_to_art",
	extempore_sr = "extempore_sr",
	extempore_jr = "extempore_jr",
	painting_sr = "painting_sr",
	painting_jr = "painting_jr",
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
	app.group("/events", (app) =>
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
				async ({ set, log, body, params: { id } }) => {
					log.info(`/event/join/${id}`);

					if (
						(id === category.math ||
							id === category.extempore_jr ||
							id === category.painting_jr ||
							id === category.science_exhibition) &&
						body.school_user_id
					) {
						log.info("solo school event");
						if (!body.school_user_id) {
							set.status = 400;
							throw new Error("school_user_id is required");
						}

						const school_user =
							await db.query.school_users.findFirst({
								where: eq(school_users.id, body.school_user_id),
								with: {
									event: true,
								},
							});

						if (!school_user) {
							set.status = 400;
							throw new Error("User not found");
						}

						if (
							school_user.event.some((obj) => obj.category === id)
						) {
							return {
								message: "Already joined",
							};
						}

						await db.insert(events).values({
							category: id,
							school_user_id: body.school_user_id,
						});

						await sendEmail(
							school_user.name,
							school_user.email,
							`Successfully joined ${id} event`,
							`You have successfully joined ${id} event. We wish you all the best 🎉\n\n and you can contact us for any queries.`,
						);

						return {
							message: "Successfully joined",
						};
					}

					if (id === category.science_exhibition) {
						if (!body.team_id) {
							set.status = 400;
							throw new Error("team_id is required");
						}

						const team = await db.query.teams.findFirst({
							where: eq(teams.code, body.team_id),
							with: {
								event: true,
								school_members: true,
								college_members: true,
							},
						});

						if (!team) {
							set.status = 400;
							throw new Error("Team not found");
						}

						if (
							team.school_members.length >= 1 &&
							team.school_members.length <= 2
						) {
							set.status = 400;
							throw new Error(
								"School team must have 1 - 2 members",
							);
						}

						if (team.event.some((obj) => obj.category === id)) {
							return {
								message: "Already joined",
							};
						}

						await db.insert(events).values({
							category: id,
							team_id: body.team_id,
						});

						sendEmail(
							team.name,
							team.leader_email,
							`Successfully joined ${id} event`,
							`You have successfully joined ${id} event. We wish you all the best 🎉\n\n and you can contact us for any queries.`,
						);

						return {
							message: "Successfully joined",
						};
					}

					if (
						(id === category.extempore_sr ||
							id === category.painting_sr ||
							id === category.creative_writing ||
							id === category.circuits ||
							id === category.frontend ||
							id === category.ui_ux) &&
						body.college_user_id
					) {
						log.info(`solo college ${id} event`);
						if (!body.college_user_id) {
							set.status = 400;
							throw new Error("college_user_id is required");
						}

						log.info(body.college_user_id);

						const college_user =
							await db.query.college_users.findFirst({
								where: eq(
									college_users.id,
									body.college_user_id,
								),
								with: {
									event: true,
								},
							});

						if (!college_user) {
							set.status = 400;
							throw new Error("User not found");
						}

						if (
							college_user.event.some(
								(obj) => obj.category === id,
							)
						) {
							return {
								message: "Already joined",
							};
						}

						await db.insert(events).values({
							category: id,
							college_user_id: body.college_user_id,
						});

						await sendEmail(
							college_user.name,
							college_user.email,
							`Successfully joined ${id} event`,
							`You have successfully joined ${id} event. We wish you all the best 🎉\n\n and you can contact us for any queries.`,
						);

						return {
							message: "Successfully joined",
						};
					}

					if (
						id === category.frontend ||
						id === category.circuits ||
						id === category.ui_ux ||
						id === category.ctf ||
						id === category.webathon ||
						id === category.treasure_hunt ||
						id === category.maze_solver ||
						id === category.race ||
						id === category.iot ||
						id === category.cad ||
						id === category.waste_to_art
					) {
						if (!body.team_id) {
							set.status = 400;
							throw new Error("team_id is required");
						}

						const team = await db.query.teams.findFirst({
							where: eq(teams.code, body.team_id),
							with: {
								event: true,
								college_members: true,
								school_members: true,
							},
						});

						if (!team) {
							set.status = 400;
							throw new Error("Team not found");
						}

						if (
							(id === category.frontend &&
								team.college_members.length <= 2 &&
								team.college_members.length >= 1) ||
							(id === category.ui_ux &&
								team.college_members.length <= 2 &&
								team.college_members.length >= 1) ||
							(id === category.ctf &&
								team.college_members.length <= 4 &&
								team.college_members.length >= 3) ||
							(id === category.webathon &&
								team.college_members.length <= 5 &&
								team.college_members.length >= 3) ||
							(id === category.treasure_hunt &&
								team.college_members.length <= 3 &&
								team.college_members.length >= 2) ||
							(id === category.maze_solver &&
								team.college_members.length <= 4 &&
								team.college_members.length >= 2) ||
							(id === category.race &&
								team.college_members.length <= 4 &&
								team.college_members.length >= 2) ||
							(id === category.iot &&
								team.college_members.length <= 3 &&
								team.college_members.length >= 2) ||
							(id === category.circuits &&
								team.college_members.length <= 2 &&
								team.college_members.length >= 1) ||
							(id === category.cad &&
								team.college_members.length <= 3 &&
								team.college_members.length >= 2) ||
							(id === category.waste_to_art &&
								team.college_members.length <= 5 &&
								team.college_members.length >= 3)
						) {
							if (team.event.some((obj) => obj.category === id)) {
								return {
									message: "Already joined",
								};
							}

							await db.insert(events).values({
								category: id,
								team_id: body.team_id,
							});

							sendEmail(
								team.name,
								team.leader_email,
								`Successfully joined ${id} event`,
								`You have successfully joined ${id} event. We wish you all the best 🎉\n\n and you can contact us for any queries.`,
							);

							return {
								message: "Successfully joined",
							};
						}

						set.status = 422;
						return {
							message: "Invalid Team Member Count",
						};
					}
				},
				{
					params: t.Object({
						id: t.Enum(category),
					}),
					body: t.Object({
						team_id: t.Optional(t.String()),
						college_user_id: t.Optional(t.String()),
						school_user_id: t.Optional(t.String()),
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
									"creative_writing | waste_to_art | extempore_sr | painting_sr | extempore_jr | painting_jr |ui_ux | frontend | ctf |	webathon | treasure_hunt | maze_solver | race | iot |circuits |science_exhibition |cad | math",
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
									"Invalid event | User tampered with the cookie",
							},
							401: { description: "User not logged in" },
							500: { description: "Internal server error" },
						},
						tags: ["event"],
					},
				},
			),
	);
