import { logger } from "@bogeychan/elysia-logger";

export const log = logger({
	autoLogging: true,
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
});
