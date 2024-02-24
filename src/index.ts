import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { community } from "./routes/community";
import { health_check } from "./routes/health_check";
import { user } from "./routes/user";
import { workshop } from "./routes/workshop";

new Elysia()
	.use(
		swagger({
			path: "/docs",
			documentation: {
				info: {
					title: "messiah",
					version: "0.1.0",
				},
			},
		}),
	)
	.use(community)
	.use(workshop)
	.use(user)
	.use(health_check)
	.listen(process.env.PORT || 3000);
