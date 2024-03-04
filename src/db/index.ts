import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const pool = postgres({
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	host: process.env.DATABASE_HOST,
	port: Number(process.env.DATABASE_PORT),
	database: process.env.DATABASE_NAME,
	// ssl: process.env.NODE_ENV === "production" ? "require" : false,
});

export const db = drizzle(pool, {
	schema,
});
