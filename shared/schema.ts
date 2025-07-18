import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  dateOfBirth: text("date_of_birth").notNull(),
  contactNumber: text("contact_number").notNull(),
  role: text("role").notNull().default("user"), // "user" or "admin"
  createdAt: timestamp("created_at").defaultNow(),
});

// Membership requests table
export const membershipRequests = pgTable("membership_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  plan: text("plan").notNull(), // "3-days", "15-days", "30-days"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "approved", "rejected"
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
});

// Active memberships table
export const activeMemberships = pgTable("active_memberships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  plan: text("plan").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Celebrities table
export const celebrities = pgTable("celebrities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  profession: text("profession").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  isFree: boolean("is_free").default(false),
  price: decimal("price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Albums table
export const albums = pgTable("albums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageCount: integer("image_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Videos table
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  videoUrl: text("video_url").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: text("duration"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Slideshow images table
export const slideshowImages = pgTable("slideshow_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  role: true,
});

export const insertMembershipRequestSchema = createInsertSchema(membershipRequests).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
  status: true,
});

export const insertCelebritySchema = createInsertSchema(celebrities).omit({
  id: true,
  createdAt: true,
});

export const insertAlbumSchema = createInsertSchema(albums).omit({
  id: true,
  createdAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertSlideshowImageSchema = createInsertSchema(slideshowImages).omit({
  id: true,
  createdAt: true,
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MembershipRequest = typeof membershipRequests.$inferSelect;
export type InsertMembershipRequest = z.infer<typeof insertMembershipRequestSchema>;
export type ActiveMembership = typeof activeMemberships.$inferSelect;
export type Celebrity = typeof celebrities.$inferSelect;
export type InsertCelebrity = z.infer<typeof insertCelebritySchema>;
export type Album = typeof albums.$inferSelect;
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type SlideshowImage = typeof slideshowImages.$inferSelect;
export type InsertSlideshowImage = z.infer<typeof insertSlideshowImageSchema>;
export type LoginData = z.infer<typeof loginSchema>;
