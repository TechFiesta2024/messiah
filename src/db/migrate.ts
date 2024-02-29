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

		await pool`
    CREATE OR REPLACE FUNCTION enforce_unique_elements()
    RETURNS TRIGGER AS $$
    BEGIN
      IF (
        SELECT COUNT(DISTINCT element)
        FROM unnest(NEW.workshops) element
      ) <> cardinality(NEW.workshops)
      THEN
        RAISE EXCEPTION 'you have already joined this workshop';
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql`.execute();

		console.log("created function successfully");

		await pool`
	   CREATE OR REPLACE TRIGGER check_unique_elements
	   BEFORE INSERT OR UPDATE
	   ON users
	   FOR EACH ROW
	   EXECUTE FUNCTION enforce_unique_elements()`.execute();

		console.log("created trigger successfully");

		console.log("migrations ran successfully");

		pool.end();
	} catch (error) {
		console.error("error running migrations", error);
	}
})();
