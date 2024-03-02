import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { log } from "./log";
import { community } from "./routes/community";
import { health_check } from "./routes/health_check";
import { user } from "./routes/user";
import { workshop } from "./routes/workshop";

const app = new Elysia()
	.use(
		swagger({
			path: "/docs",
			documentation: {
				info: {
					title: "messiah",
					version: "0.3.0",
				},
			},
		}),
	)
	.use(
		cors({
			allowedHeaders: ["Content-Type"],
		}),
	)
	.use(community)
	.use(workshop)
	.use(user)
	.use(health_check)
	.use(log)
	.listen(process.env.PORT || 3000);

export type App = typeof app;
