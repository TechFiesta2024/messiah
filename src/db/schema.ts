import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey(),
	createAt: timestamp("create_at").notNull().defaultNow(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	college: text("college").notNull(),
	stream: text("stream").notNull(),
	contact: text("contact").notNull().unique(),
	year: text("year").notNull(),
	workshops: text("workshops").array().notNull(),
	team: text("team").references(() => teams.id),
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

export const teams = pgTable("teams", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	leader_email: text("leader_email")
		.references(() => users.email)
		.notNull(),
	leader_contact: text("leader_contact")
		.references(() => users.contact)
		.notNull(),
	members: text("members").array().notNull(),
	events: text("events").array(),
});

export const usersRelations = relations(users, ({ one }) => ({
	teams: one(users),
}));

export const teamsRelations = relations(teams, ({ many, one }) => ({
	leader_email: one(users, {
		fields: [teams.leader_email],
		references: [users.email],
	}),
	leader_contact: one(users, {
		fields: [teams.leader_contact],
		references: [users.contact],
	}),
	members: many(users),
}));

export const event_uiux = pgTable("event_uiux", {
	team_name: text("name").notNull(),
	leader_email: text("email").notNull().unique(),
	leader_contact: text("contact").notNull().unique(),
	isPaid: text("isPaid").default("no").notNull(),
});
