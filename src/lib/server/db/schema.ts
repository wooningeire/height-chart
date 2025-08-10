import { pgTable, serial, text, integer, uuid, varchar, vector, real, jsonb, bigint, foreignKey } from 'drizzle-orm/pg-core';

export const userTable = pgTable("user", {
	discordId: bigint({mode: "number"}).notNull(),
})
	.enableRLS();

export const characterTable = pgTable("character", {
	id: serial().primaryKey(),
	name: varchar({length: 256}).notNull(),
	referenceCurve: jsonb().notNull(),
	targetLength: real().notNull(),
	offsetPos: real().array().notNull(),
	offsetScale: real().array().notNull(),
})
	.enableRLS();


export const collectionTable = pgTable("collection", {
	id: serial().primaryKey(),
	name: varchar({length: 256}).notNull(),
})
	.enableRLS();


export const characterBelongsToCollectionTable = pgTable("character_belongs_to_collection", {
	characterId: integer().notNull(),
	collectionId: integer().notNull(),
}, table => [
	foreignKey({columns: [table.characterId], foreignColumns: [characterTable.id]}),
	foreignKey({columns: [table.collectionId], foreignColumns: [collectionTable.id]}),
])
	.enableRLS();