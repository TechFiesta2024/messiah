import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const pool = postgres({
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	host: process.env.DATABASE_HOST,
	port: Number(process.env.DATABASE_PORT),
	database: process.env.DATABASE_NAME,
	ssl: process.env.NODE_ENV === "production" ? "require" : false,
	max: 1,
});

const db = drizzle(pool);

(async () => {
	try {
		await migrate(db, {
			migrationsFolder: "migrations",
		});

		console.log("migrations ran successfully");

		pool.end();
	} catch (error) {
		console.error("error running migrations", error);
	}
})();
