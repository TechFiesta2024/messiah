import { logger } from "@bogeychan/elysia-logger";
import { Elysia } from "elysia";

import { pool } from "./db";

const hello = async () => {
	const ans = await pool.query("SELECT NOW()");

	return ans.rows[0];
};

const log = logger({
	autoLogging: true,
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
});

new Elysia()
	.use(log)
	.get("/", hello)
	.listen(process.env.PORT || 3000);
