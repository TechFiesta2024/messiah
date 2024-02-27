import { cookie } from "@elysiajs/cookie";
import { Elysia, t } from "elysia";

import { eq } from "drizzle-orm";
import { db } from "../db";
import {
	users,
	workshopCAD,
	workshopCTF,
	workshopHardware,
	workshopProduct,
} from "../db/schema";
import { log } from "../log";

const updateWorkshop = async (userId: string, workshop: string) => {
	const userInfo = await db.select().from(users).where(eq(users.id, userId));

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
			default:
				throw new Error("Workshop not found");
		}

		// TODO: cookie hacking throw an error if the user is not found
		const updatedUser = await db
			.update(users)
			.set({ workshops: userInfo[0].workshops })
			.where(eq(users.id, userId))
			.returning({ name: users.name, email: users.email });

		return updatedUser[0];
	}
};

export const workshop = (app: Elysia) =>
	app.group("/workshop", (app) =>
		app
			.use(log)
			.use(
				cookie({
					httpOnly: true,
				}),
			)
			.onError((ctx) => {
				ctx.log.error(ctx.error.message);
				return {
					message: ctx.error.message,
				};
			})
			.post(
				"/join/:id",
				async ({ set, log, cookie: { user }, params: { id } }) => {
					if (!user) {
						set.status = 401;
						throw new Error("user not logged in");
					}
					log.info({ user, id });

					const updatedUser = await updateWorkshop(user, id);

					if (updatedUser) {
						return {
							message: `Congratulations ${updatedUser.name}, you have successfully joined the ${id}!`,
						};
					}
				},
				{
					params: t.Object({
						id: t.String({}),
					}),
					detail: {
						summary: "Join a workshop",
						description:
							"Join a workshop by providing the workshop id",
						responses: {
							200: { description: "Success" },
							401: { description: "User not logged in" },
							500: { description: "Internal server error" },
						},
						tags: ["workshop"],
					},
				},
			),
	);
