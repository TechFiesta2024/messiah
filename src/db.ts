import { Pool } from "pg";

export const pool = new Pool({
	user: "postgres",
	host: "devpostgres.orb.local",
	database: "techfiesta24",
	password: "password",
	port: 5432,
});
