import { pgTable, serial, integer, text, varchar } from 'drizzle-orm/pg-core';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  body: text('body').notNull(),
});
