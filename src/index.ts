import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { log } from "./log";
import { community } from "./routes/community";
import { event } from "./routes/events";
import { health_check } from "./routes/health_check";
import { team } from "./routes/teams";
import { user } from "./routes/user";
import { workshop } from "./routes/workshop";

console.log("ORIGIN: ", process.env.ORIGIN);

const app = new Elysia()
	.use(
		cors({
			origin: process.env.ORIGIN,
		}),
	)
	.use(community)
	.use(workshop)
	.use(user)
	.use(team)
	.use(event)
	.use(health_check)
	.use(log)
	.listen(process.env.PORT || 3000);

export type App = typeof app;
