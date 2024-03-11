import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const college_users = pgTable("college_users", {
	id: uuid("id").primaryKey(),
	createAt: timestamp("create_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	college: text("college").notNull(),
	stream: text("stream").notNull(),
	contact: text("contact").notNull().unique(),
	year: text("year").notNull(),
	team_id: text("team_id").references(() => teams.code),
});

export const college_users_relations = relations(
	college_users,
	({ many, one }) => ({
		workshop: many(workshops),
		team: one(teams, {
			fields: [college_users.team_id],
			references: [teams.code],
		}),
		event: many(events),
	}),
);

export const workshop_enum = pgEnum("category", [
	"product_design",
	"hardware",
	"cad",
	"ctf",
]);

export const workshops = pgTable("workshop", {
	category: workshop_enum("category").notNull(),
	user_email: text("user_email")
		.notNull()
		.references(() => college_users.email),
});

export const workshop_relations = relations(workshops, ({ one }) => ({
	user_email: one(college_users, {
		fields: [workshops.user_email],
		references: [college_users.email],
	}),
}));

export const teams = pgTable("teams", {
	name: text("name").notNull(),
	leader_email: text("leader_email").notNull().unique(),
	leader_contact: text("leader_contact").notNull().unique(),
	code: text("code").notNull().unique(),
});

export const teams_relations = relations(teams, ({ many }) => ({
	members: many(college_users),
	event: many(events),
}));

export const event_enum = pgEnum("category", [
	"creative_writing",
	"waste_to_art",
	"extempore",
	"painting",
	"ui_ux",
	"frontend",
	"ctf",
	"webathon",
	"treasure_hunt",
	"maze_solver",
	"race",
	"iot",
	"circuits",
	"science_exhibition",
	"cad",
	"math",
]);

export const events = pgTable("events", {
	category: event_enum("category").notNull(),
	team_id: text("team_id")
		.unique()
		.references(() => teams.code),
	college_user_id: uuid("college_user_id")
		.unique()
		.references(() => college_users.id),
	school_user_id: uuid("school_user_id")
		.unique()
		.references(() => school_users.id),
	payment_status: text("payment_status").default("not_paid").notNull(),
});

export const events_relations = relations(events, ({ one }) => ({
	college_user: one(college_users, {
		fields: [events.college_user_id],
		references: [college_users.id],
	}),
	college_team: one(teams, {
		fields: [events.team_id],
		references: [teams.code],
	}),
	school_user: one(school_users, {
		fields: [events.school_user_id],
		references: [school_users.id],
	}),
}));

export const school_users = pgTable("school_users", {
	id: uuid("id").primaryKey(),
	createAt: timestamp("create_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	school: text("school").notNull(),
	contact: text("contact").notNull().unique(),
	class: text("class").notNull(),
	guardian_contact: text("gardian_contact").notNull(),
	guardian_name: text("gardian_name").notNull(),
});

export const school_users_relations = relations(school_users, ({ many }) => ({
	event: many(events),
}));

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
