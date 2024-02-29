import { randomUUID } from "node:crypto";
import { Elysia, t } from "elysia";
import { PostgresError } from "postgres";

import { db } from "../db";
import { ambassadors, communities } from "../db/schema";
import { sendEmail } from "../email";
import { log } from "../log";

export const community = (app: Elysia) =>
	app.group("/community", (app) =>
		app
			.use(log)
			.onError((ctx) => {
				ctx.log.error(ctx.error.message);

				return {
					message: ctx.error.message,
				};
			})
			.post(
				"/ambassador",
				async ({ set, body, log }) => {
					log.info(body);

					try {
						await db.insert(ambassadors).values({
							id: randomUUID(),
							...body,
						});

						await sendEmail(
							body.ambassador_name,
							body.ambassador_email,
							"Ambassador Registration",
							"Congratulations! You have successfully registered as an ambassador!",
						);
					} catch (error) {
						if (
							error instanceof PostgresError &&
							error.code === "23505"
						) {
							set.status = 409;
							throw new Error("ambassador already exists");
						}
					}

					return {
						message:
							"well done! you have successfully registered as an ambassador!",
					};
				},
				{
					body: t.Object({
						ambassador_name: t.String(),
						ambassador_email: t.String({
							format: "email",
							errror: "invalid email",
						}),
						ambassador_college: t.String(),
						ambassador_contact: t.String({
							maxLength: 10,
							minLength: 10,
							error: "invalid contact number",
						}),
						ambassador_linkedin: t.String(),
						ambassador_description: t.String({
							maxLength: 200,
						}),
					}),
					detail: {
						summary: "Register as an ambassador",
						discription:
							"Register as an ambassador by providing the required details",
						responses: {
							200: { description: "Success" },
							409: { description: "Already exists" },
							500: { description: "Internal server error" },
						},
						tags: ["ambassador"],
					},
				},
			)
			.post(
				"/collab",
				async ({ set, log, body }) => {
					log.info(body);

					try {
						await db.insert(communities).values({
							id: randomUUID(),
							...body,
						});

						await sendEmail(
							body.community_lead_name,
							body.community_email,
							"Community Registration",
							"Congratulations! You have successfully registered as a community collaborator!",
						);
					} catch (error) {
						if (
							error instanceof PostgresError &&
							error.code === "23505"
						) {
							set.status = 409;
							throw new Error("community already exists");
						}
					}

					return {
						message:
							"well done! you have successfully registered as a community!",
					};
				},
				{
					body: t.Object({
						community_name: t.String(),
						community_email: t.String({
							format: "email",
							errror: "invalid email",
						}),
						community_college: t.String(),
						community_lead_name: t.String(),
						community_linkedin: t.String(),
						community_contact: t.String({
							maxLength: 10,
							minLength: 10,
							error: "invalid contact number",
						}),
					}),
					detail: {
						summary: "Register as a community collaborator",
						description:
							"Register as a community collaborator by providing the required details",
						responses: {
							200: { description: "Success" },
							409: { description: "Already exists" },
							500: { description: "Internal server error" },
						},
						tags: ["community"],
					},
				},
			),
	);
