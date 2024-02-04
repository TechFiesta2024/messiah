import { LibsqlError, createClient } from "@libsql/client/web";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AmbassadorSchema } from "./types/ambassador";
import { CommunitySchema } from "./types/community";
import { events } from "./types/events";
import { workshops } from "./types/workshops";
import { generateRandomString } from "./utils/gen-random";

const app = new Hono();

app.use("*", logger());

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

	const ambassador = AmbassadorSchema.safeParse({
		...body,
		id: crypto.randomUUID(),
		created_at: new Date().toISOString(),
		referral_code: generateRandomString(8),
	});

	if (!ambassador.success) {
		return c.json(ambassador.error, 400);
	}

	try {
		await client.execute({
			sql: "insert into ambassadors values (:id, :email, :created_at, :college, :contact, :name, :linkedin, :twitter, :description, :referral_code)",
			args: { ...ambassador.data },
		});
	} catch (error) {
		if (error instanceof LibsqlError) {
			if (error.message.includes("UNIQUE"))
				return c.json("user already exists", 400);
		}
		return c.json("server error", 500);
	}

	try {
		await fetch("https://api.brevo.com/v3/smtp/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"api-key": BREVOKEY,
				accept: "application/json",
			},
			body: `{"sender":{"name":"TechFiesta Tech Team","email":"devlemon@mail.com"},"to":[{"email":"${ambassador.data.email}","name":"${ambassador.data.name}"}],"subject":"Welcome to TechFiesta 2024","htmlContent":"<html><head></head><body><p>Hello,</p>Thank you for joining our campus ambassador program.</p></body></html>"}`,
		});
	} catch (error) {
		console.log(error);
		return c.json("error in sending email", 500);
	}

	return c.json("successfully added", 200);
});

app.post("/join/community", async (c) => {
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

	const community = CommunitySchema.safeParse({
		...body,
		id: crypto.randomUUID(),
		created_at: new Date().toISOString(),
	});

	if (!community.success) {
		return c.json(community.error, 400);
	}

	try {
		await client.execute({
			sql: "insert into community values (:id, :email, :created_at, :college, :contact, :socials, :name)",
			args: {
				...community.data,
				socials: JSON.stringify(community.data.socials),
			},
		});
	} catch (error) {
		if (error instanceof LibsqlError) {
			if (error.message.includes("UNIQUE"))
				return c.json("user already exists", 400);
		}
		return c.json("server error", 500);
	}

	try {
		await fetch("https://api.brevo.com/v3/smtp/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"api-key": BREVOKEY,
				accept: "application/json",
			},
			body: `{"sender":{"name":"TechFiesta Tech Team","email":"devlemon@mail.com"},"to":[{"email":"${community.data.email}","name":"${community.data.name}"}],"subject":"Welcome to TechFiesta 2024","htmlContent":"<html><head></head><body><p>Hello,</p>Thank you for joining our community collab.</p></body></html>"}`,
		});
	} catch (error) {
		console.log(error);
		return c.json("error in sending email", 500);
	}

	return c.json(community.data, 200);
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
