import { pgTable, serial, text, integer, uuid, varchar, vector, real, jsonb } from 'drizzle-orm/pg-core';

export const characterTable = pgTable("character", {
	id: serial().primaryKey(),
	name: varchar({length: 256}).notNull(),
	referenceCurve: jsonb().notNull(),
	targetLength: real().notNull(),
	offsetPos: real().array().notNull(),
	offsetScale: real().array().notNull(),
})
	.enableRLS();