import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { supabase } from "$/lib/server/supabase";
import { db } from "$/lib/server/db";
import { userTable } from "$/lib/server/db/schema";
import { count, eq } from "drizzle-orm";
import { getUser as getSupabaseUser } from "$/lib/server/auth";

export const POST: RequestHandler = async ({request}) => {
    const supabaseUser = await getSupabaseUser(request);
    if (supabaseUser === null) return error(401, "Not logged in");


    const existingRows = await db.select({count: count()})
        .from(userTable)
        .where(eq(userTable.discordId, BigInt(supabaseUser.user_metadata.provider_id)))
        .limit(1);

    if (existingRows.length === 0) {
        await db.insert(userTable)
            .values({
                discordId: BigInt(supabaseUser.id),
                discordAvatarUrl: supabaseUser.user_metadata.avatar_url,
                discordDisplayName: supabaseUser.user_metadata.full_name,
            });
    } else {
        await db.update(userTable)
            .set({
                discordAvatarUrl: supabaseUser.user_metadata.avatar_url,
                discordDisplayName: supabaseUser.user_metadata.full_name,
            })
            .where(eq(userTable.discordId, BigInt(supabaseUser.user_metadata.provider_id)));
    }

    return json({});
};