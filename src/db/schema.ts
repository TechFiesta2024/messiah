import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/* unique workshop array elements
CREATE OR REPLACE FUNCTION enforce_unique_elements()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(DISTINCT element)
    FROM unnest(NEW.workshops) element
  ) <> cardinality(NEW.workshops)
  THEN
RAISE EXCEPTION 'you have already joined this workshop'
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_unique_elements
BEFORE INSERT OR UPDATE
ON users
FOR EACH ROW
EXECUTE FUNCTION enforce_unique_elements();
*/

export const users = pgTable("users", {
	id: uuid("id").primaryKey(),
	createAt: timestamp("create_at").notNull().defaultNow(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	college: text("college").notNull(),
	stream: text("stream").notNull(),
	year: text("year").notNull(),
	workshops: text("workshops").array().notNull(),
});

export const communities = pgTable("communities", {
	id: uuid("id").primaryKey(),
	createAt: timestamp("create_at").notNull().defaultNow(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	college: text("college").notNull(),
	contact: text("contact").notNull(),
});

export const ambassadors = pgTable("ambassadors", {
	id: uuid("id").primaryKey(),
	createAt: timestamp("create_at").notNull().defaultNow(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	college: text("college").notNull(),
	contact: text("contact").notNull(),
	description: text("description").notNull(),
	linkedin: text("linkedin"),
	twitter: text("twitter"),
});

export const workshopProduct = pgTable("workshop_product", {
	name: text("name").notNull(),
	email: text("email").notNull().primaryKey().unique(),
	college: text("college").notNull(),
	stream: text("stream").notNull(),
	year: text("year").notNull(),
});

export const workshopCTF = pgTable("workshop_ctf", {
	name: text("name").notNull(),
	email: text("email").notNull().primaryKey().unique(),
	college: text("college").notNull(),
	stream: text("stream").notNull(),
	year: text("year").notNull(),
});

export const workshopHardware = pgTable("workshop_hardware", {
	name: text("name").notNull(),
	email: text("email").notNull().primaryKey().unique(),
	college: text("college").notNull(),
	stream: text("stream").notNull(),
	year: text("year").notNull(),
});

export const workshopCAD = pgTable("workshop_cad", {
	name: text("name").notNull(),
	email: text("email").notNull().primaryKey().unique(),
	college: text("college").notNull(),
	stream: text("stream").notNull(),
	year: text("year").notNull(),
});
