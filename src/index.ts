import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { log } from "./log";
import { community } from "./routes/community";
import { health_check } from "./routes/health_check";
import { team } from "./routes/teams";
import { user } from "./routes/user";
import { workshop } from "./routes/workshop";
import { event } from "./routes/events";

const app = new Elysia()
	.use(
		swagger({
			path: "/docs",
			documentation: {
				info: {
					title: "messiah",
					version: "0.9.0",
				},
			},
		}),
	)
	.use(cors())
	.use(community)
	.use(workshop)
	.use(user)
	.use(team)
	.use(event)
	.use(health_check)
	.use(log)
	.listen(process.env.PORT || 3000);

export type App = typeof app;
