import { cookie } from "@elysiajs/cookie";
import { Elysia, t } from "elysia";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { log } from "../log";

const updateWorkshop = async (userId: string, workshop: string) => {
	const userInfo = await db.select().from(users).where(eq(users.id, userId));

	userInfo[0].workshops.push(workshop);
	const updatedUser = await db
		.update(users)
		.set({
			workshops: userInfo[0].workshops,
		})
		.where(eq(users.id, userInfo[0].id))
		.returning({
			name: users.name,
			email: users.email,
		});

	return updatedUser[0];
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
					try {
						if (!user) {
							throw new Error("user not logged in");
						}

						if (id === "product_design") {
							const updatedUser = await updateWorkshop(user, id);
							return `Congratulations ${updatedUser.name}, you have successfully joined the Product Development Workshop!`;
						}
					} catch (error) {
						log.error(error);
						return "oops";
					}
				},
				{
					params: t.Object({
						id: t.String({}),
					}),
				},
			),
	);
