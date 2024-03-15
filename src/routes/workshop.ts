import { eq } from "drizzle-orm";
import { type Elysia, t } from "elysia";

import { db } from "../db";
import { college_users, workshops } from "../db/schema";
import { sendEmail } from "../email";
import {
	backend_deploy_email,
	business_logic_email,
	cad_signup_email,
	circuit_email,
	ctf_signup_email,
	embedded_systems,
	fpga_email,
	git_github_email,
	iot_workshop_email,
	product_design_cycle_email,
	robotics_email,
} from "../emails";
import { log } from "../log";

enum category {
	product_design_lifecycle = "product_design_lifecycle",
	git = "git",
	business_logic = "business_logic",
	backend_deploy = "backend_deploy",
	robotics = "robotics",
	cad = "cad",
	ctf = "ctf",
	circuits = "circuits",
	iot = "iot",
	fpga = "fpga",
	embedded = "embedded",
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

					// if (
					// 	(user.workshop.some(
					// 		(obj) => obj.category === category.hardware,
					// 	) &&
					// 		id === category.product_design) ||
					// 	(user.workshop.some(
					// 		(obj) => obj.category === category.product_design,
					// 	) &&
					// 		id === category.hardware)
					// ) {
					// 	set.status = 400;
					// 	return {
					// 		message:
					// 			"Cannot join workshop as it coliides with another workshop 🥺",
					// 	};
					// }

					await db.insert(workshops).values({
						category: id as category,
						user_email: user.email,
					});

					if (id === category.product_design_lifecycle) {
						await sendEmail(
							user.name,
							user.email,
							"Successfully joined product design lifecycle workshop 🎨",
							product_design_cycle_email,
						);
					}

					if (id === category.git) {
						await sendEmail(
							user.name,
							user.email,
							"Successfully joined git workshop 🎨",
							git_github_email,
						);
					}

					if (id === category.business_logic) {
						await sendEmail(
							user.name,
							user.email,
							"Successfully joined business logic workshop 🎨",
							business_logic_email,
						);
					}

					if (id === category.backend_deploy) {
						await sendEmail(
							user.name,
							user.email,
							"Successfully joined backend deploy workshop 🎨",
							backend_deploy_email,
						);
					}

					if (id === category.cad) {
						await sendEmail(
							user.name,
							user.email,
							"Successfully joined cad workshop 🎨",
							cad_signup_email,
						);
					}

					if (id === category.ctf) {
						await sendEmail(
							user.name,
							user.email,
							"Successfully joined ctf workshop 🎨",
							ctf_signup_email,
						);
					}

					if (id === category.fpga) {
						await sendEmail(
							user.name,
							user.email,
							"Successfully joined fpga workshop 🎨",
							fpga_email,
						);
					}

					if (id === category.embedded) {
						await sendEmail(
							user.name,
							user.email,
							"Successfully joined embedded systems workshop 🎨",
							embedded_systems,
						);
					}

					if (id === category.circuits) {
						await sendEmail(
							user.name,
							user.email,
							"Successfully joined circuits workshop 🎨",
							circuit_email,
						);
					}

					if (id === category.iot) {
						await sendEmail(
							user.name,
							user.email,
							"Successfully joined iot workshop 🎨",
							iot_workshop_email,
						);
					}

					if (id === category.robotics) {
						await sendEmail(
							user.name,
							user.email,
							"Successfully joined robotics workshop 🎨",
							robotics_email,
						);
					}

					return {
						message: "Successfully joined",
					};
				},
				{
					params: t.Object({
						id: t.Enum(category, { error: "Invalid workshop" }),
					}),
					headers: t.Object({
						userid: t.String({
							minLength: 36,
							maxLength: 36,
							error: "Invalid user id",
						}),
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
