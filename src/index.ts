import { serverTiming } from "@elysiajs/server-timing";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { community } from "./routes/community";
import { health_check } from "./routes/health_check";
import { user } from "./routes/user";
import { workshop } from "./routes/workshop";

new Elysia()
	.use(community)
	.use(workshop)
	.use(user)
	.use(health_check)
	.use(serverTiming())
	.use(
		swagger({
			path: "/docs",
		}),
	)
	.listen(process.env.PORT || 3000);
