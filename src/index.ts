import { logger } from "@bogeychan/elysia-logger";
import { Elysia } from "elysia";

const hello = () => {
	return "Hello lemon";
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
