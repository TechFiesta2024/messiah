import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

(async () => {
	try {
		await migrate(db, {
			migrationsFolder: "migrations",
		});
		console.log("migrations ran successfully");
	} catch (error) {
		console.error("error running migrations", error);
	}
})();
