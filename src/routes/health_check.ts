import { Elysia } from "elysia";

import { log } from "../log";

export const health_check = (app: Elysia) =>
	app.use(log).get("/health_check", ({ log }) => {
		log.info("Health check passed");
		return "hiii";
	});
