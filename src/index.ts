import { Hono } from "hono";
import { workshops } from "./types/workshops";
import { events } from "./types/events";

const app = new Hono();

// TODO
// 1. user registration
// 2. CI/CD pipeline
// 3. testing

const demoWorkshops = workshops;
const demoEvents = events;

app.get("/", (c) => {
	return c.html("<h1>Bye World 🌎</h1>");
});

app.get("/workshops", (c) => {
	return c.json(demoWorkshops);
});

app.get("/workshops/:id", (c) => {
	const id = c.req.param("id");
	return c.json(demoWorkshops.find((w) => w.id === Number(id)));
});

app.get("/events", (c) => {
	return c.json(demoEvents);
});

app.get("/events/:id", (c) => {
	const id = c.req.param("id");
	return c.json(demoEvents.find((e) => e.id === Number(id)));
});

export default app;
