import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "user"]);

// NextAuth tables - must use singular "user" not "users"
export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),

  // Custom fields for your app
  password: text("password"),
  role: roleEnum("role").default("user"),
  profileImageUrl: text("profile_image_url"),
  profileImagePublicId: text("profile_image_public_id"),
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpiry: timestamp("reset_token_expiry", {
    withTimezone: true,
    mode: "string",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const account = pgTable("account", {
  id: serial("id").primaryKey(),
  userId: uuid("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const session = pgTable("session", {
  id: serial("id").primaryKey(),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: uuid("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationToken = pgTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Links tables
export const iconTypeEnum = pgEnum("icon_type", ["icon", "list"]);

export const links = pgTable("links", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  href: text("href"),
  label: varchar("label", { length: 255 }).notNull(),
  icon: text("icon").notNull(),
  cloudinaryPublicId: text("cloudinary_public_id"),
  type: iconTypeEnum("type").default("icon"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const linkChildren = pgTable("link_children", {
  id: uuid("id").defaultRandom().primaryKey(),
  parentId: uuid("parent_id")
    .references(() => links.id, { onDelete: "cascade" })
    .notNull(),
  href: text("href").notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  icon: text("icon").notNull(),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Link = typeof links.$inferSelect;
export type LinkChild = typeof linkChildren.$inferSelect;
