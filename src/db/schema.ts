import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email', {length: 255}).unique().notNull(),
    password: text('password', {length: 255}).notNull(),
    role: text('role', {length: 255}).notNull(),
    // timestamp is set on insert
    createdAt: text('createdAt')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  });

export const questions = sqliteTable('questions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    question: text('question', {length: 255}).notNull(),
    answer: text('answer', {length: 255}).notNull(),
    userId: integer('userId').notNull().references(() => users.id),
    processingTime: integer('processingTime').notNull(),
    modelUsed: text('modelUsed', {length: 255}).notNull(),
    // timestamp is set on insert
    createdAt: text('createdAt')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  });