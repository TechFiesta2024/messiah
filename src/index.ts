import { createClient } from "@libsql/client/web";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { v4 as uuidv4 } from "uuid";
import { Ambassador } from "./types/ambassador";
import { events } from "./types/events";
import { workshops } from "./types/workshops";

const app = new Hono();

app.get("/", (c) => {
	return c.html("<h1>Bye World 🌎</h1>");
});

app.post("/join/ambassador", async (c) => {
	const { DB_URL, AUTHTOKEN } = env<{ DB_URL: string; AUTHTOKEN: string }>(c);

	const client = createClient({
		url: DB_URL,
		authToken: AUTHTOKEN,
	});

	const body = await c.req.json();
	const ambassador: Ambassador = {
		id: uuidv4() as string,
		email: body.email as string,
		created_at: new Date().toISOString(),
		college: body.college_name as string,
		contact: body.contact as string,
		name: body.name as string,
		github: body.github as string,
		linkedin: body.linkedin as string,
		twitter: body.twitter as string,
		description: body.description as string,
		no_of_regs: body.no_of_regs as number,
		referral_code: "abc",
	};

	const result = await client.execute({
		sql: "INSERt INTO ambassadors VALUES (:id, :email, :created_at, :college, :contact, :name, :github, :linkedin, :twitter, :description, :no_of_regs, :referral_code)",
		args: { ...ambassador },
	});

	console.log(result);

	return c.json(ambassador);
});

app.get("/workshops", (c) => {
	return c.json(workshops);
});

app.get("/workshops/:id", (c) => {
	const id = c.req.param("id");
	return c.json(workshops.find((w) => w.id === Number(id)));
});

app.get("/events", (c) => {
	return c.json(events);
});

app.get("/events/:id", (c) => {
	const id = c.req.param("id");
	return c.json(events.find((e) => e.id === Number(id)));
});

export default app;
