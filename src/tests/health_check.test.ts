import { describe, expect, it } from "bun:test";
import { edenTreaty } from "@elysiajs/eden";

import type { App } from "../index";

const api = edenTreaty<App>("http://localhost:3000");

describe("Health Check", () => {
	it("should return 200", async () => {
		const res = await api.health_check.get();
		expect(res.status).toBe(200);
	});
});
