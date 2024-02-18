import { Elysia } from "elysia";

import { pool } from "./db";
import { community } from "./routes/community";

new Elysia()
	.decorate("dbpool", pool)
	.use(community)
	.listen(process.env.PORT || 3000);
