import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "../db";
import {
	users,
	workshopCAD,
	workshopCTF,
	workshopHardware,
	workshopProduct,
} from "../db/schema";
import { sendEmail } from "../email";
import { log } from "../log";

const updateWorkshop = async (userId: string, workshop: string) => {
	const userInfo = await db.select().from(users).where(eq(users.id, userId));

	if (userInfo.length !== 1) {
		throw new Error("user not found");
	}

	if (["product_design", "hardware", "cad", "ctf"].includes(workshop)) {
		userInfo[0].workshops.push(workshop);

		switch (workshop) {
			case "product_design":
				await db.insert(workshopProduct).values({ ...userInfo[0] });
				break;
			case "hardware":
				await db.insert(workshopHardware).values({ ...userInfo[0] });
				break;
			case "cad":
				await db.insert(workshopCAD).values({ ...userInfo[0] });
				break;
			case "ctf":
				await db.insert(workshopCTF).values({ ...userInfo[0] });
				break;
		}

		const updatedUser = await db
			.update(users)
			.set({ workshops: userInfo[0].workshops })
			.where(eq(users.id, userId))
			.returning({ name: users.name, email: users.email });

		return updatedUser[0];
	}

	throw new Error("workshop not found");
};

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
					if (!userid) {
						set.status = 401;
						throw new Error("user not logged in");
					}

					try {
						const updatedUser = await updateWorkshop(userid, id);

						log.info(`user ${updatedUser.name} joined ${id}`);

						await sendEmail(
							updatedUser.name,
							updatedUser.email,
							"Workshop Joined",
							`Congratulations ${updatedUser.name}, you have successfully joined the ${id}!`,
						);

						return {
							message: `Congratulations ${updatedUser.name}, you have successfully joined the ${id}!`,
						};
					} catch (error) {
						set.status = 400;
						if (error instanceof Error) {
							throw new Error(error.message);
						}
					}
				},
				{
					params: t.Object({
						id: t.String({}),
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
