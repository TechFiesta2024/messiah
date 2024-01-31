import { createClient } from "@libsql/client/web";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
// import  from "@getbrevo/brevo";
import { Ambassador } from "./types/ambassador";
import { events } from "./types/events";
import { workshops } from "./types/workshops";
import { generateRandomString } from "./utils/gen-random";

const app = new Hono();

app.use("/join/*", cors({ origin: "*" }));

app.get("/", (c) => {
	return c.html("<h1>Bye World 🌎</h1>");
});

app.post("/join/ambassador", async (c) => {
	const { DB_URL, AUTHTOKEN, BREVOKEY } = env<{
		DB_URL: string;
		AUTHTOKEN: string;
		BREVOKEY: string;
	}>(c);

	const client = createClient({
		url: DB_URL,
		authToken: AUTHTOKEN,
	});

	const body = await c.req.json();

	const ambassador: Ambassador = {
		id: crypto.randomUUID(),
		email: body.email as string,
		created_at: new Date().toISOString(),
		college: body.college as string,
		contact: body.contact as string,
		name: body.name as string,
		linkedin: body.linkedin as string,
		twitter: body.twitter as string,
		description: body.description as string,
		no_of_regs: body.no_of_regs as number,
		referral_code: generateRandomString(8),
	};

	// TODO error handling
	const result = await client.execute({
		sql: "insert into ambassadors values (:id, :email, :created_at, :college, :contact, :name, :linkedin, :twitter, :description, :no_of_regs, :referral_code)",
		args: { ...ambassador },
	});

	console.log(result.toJSON());

	const res = await fetch("https://api.brevo.com/v3/smtp/email", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"api-key": BREVOKEY,
			accept: "application/json",
		},
		body: `{"sender":{"name":"TechFiesta Tech Team","email":"devlemon@mail.com"},"to":[{"email":"${ambassador.email}","name":"${ambassador.name}"}],"subject":"Welcome to TechFiesta 2024","htmlContent":"<html><head></head><body><p>Hello,</p>Thank you for joining our campus ambassador program.</p></body></html>"}`,
	});

	console.log(res.status);

	return c.json("successfully added", 200);
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
