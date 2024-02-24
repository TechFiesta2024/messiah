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
RAISE EXCEPTION 'you have already joined this workshop';
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
	community_name: text("name").notNull(),
	community_email: text("email").notNull().unique(),
	community_college: text("college").notNull(),
	community_contact: text("contact").notNull(),
	community_lead_name: text("lead_name").notNull(),
	community_linkedin: text("linkedin").notNull(),
});

export const ambassadors = pgTable("ambassadors", {
	id: uuid("id").primaryKey(),
	createAt: timestamp("create_at").notNull().defaultNow(),
	ambassador_name: text("name").notNull(),
	ambassador_email: text("email").notNull().unique(),
	ambassador_college: text("college").notNull(),
	ambassador_contact: text("contact").notNull(),
	ambassador_description: text("description").notNull(),
	ambassador_linkedin: text("linkedin").notNull(),
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
