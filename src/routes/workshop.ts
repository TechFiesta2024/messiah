import { cookie } from "@elysiajs/cookie";
import { Elysia, t } from "elysia";

import { eq } from "drizzle-orm";
import { db } from "../db";
import {
	users,
	workshopProduct,
	workshopHardware,
	workshopCAD,
	workshopCTF,
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
				ctx.log.error(ctx, ctx.error.message);
				return ctx.error.message;
			})
			.post(
				"/join/:id",
				async ({ log, cookie: { user }, params: { id } }) => {
					if (!user) {
						throw new Error("user not logged in");
					}

					const updatedUser = await updateWorkshop(user, id);

					if (updatedUser) {
						return `Congratulations ${updatedUser.name}, you have successfully joined the ${id}!`;
					}
				},
				{
					params: t.Object({
						id: t.String({}),
					}),
				},
			),
	);
